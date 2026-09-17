#!/usr/bin/env python3
"""Bake a 1 m elevation surface for each property, as terrarium-encoded tiles.

    python3 scripts/bake-terrain.py [--site URL] [--zooms 13-17] [--pad 0.25]
                                    [--only sulphur-mountain,howard] [--out public/terrain] [--dry]

Why this exists: the atlas's terrain comes from the global AWS terrarium set, which stops at zoom
14 — about 9 m per pixel here. That is fine seen from the air and useless underfoot: at eye height
a 9 m grid is a staircase. USGS 3DEP publishes 1 m elevation for this county, so each property gets
its own small pyramid baked from it, and the engine switches to that surface when the camera is
over the property.

The encoding is terrarium — the same one the global tiles use — so nothing downstream changes:
    elevation_m = (R * 256 + G + B / 256) - 32768
which gives 1/256 m (4 mm) precision, far finer than the source.

Requests go to the ImageServer's own exportImage as float32 GeoTIFF, one call per tile, at the
tile's exact web-mercator bbox, so our pixels land on the same grid MapLibre asks for.
"""
import argparse, io, json, math, os, sys, time, urllib.parse, urllib.request

import numpy as np
from PIL import Image

DEP = 'https://elevation.nationalmap.gov/arcgis/rest/services/3DEPElevation/ImageServer/exportImage'
R = 6378137.0
TILE = 256


def merc(lon, lat):
    x = math.radians(lon) * R
    y = math.log(math.tan(math.pi / 4 + math.radians(lat) / 2)) * R
    return x, y


def tile_bbox(z, x, y):
    n = 2 ** z
    span = 2 * math.pi * R / n
    x0 = -math.pi * R + x * span
    y1 = math.pi * R - y * span
    return x0, y1 - span, x0 + span, y1


def lonlat_to_tile(lon, lat, z):
    n = 2 ** z
    xt = int((lon + 180.0) / 360.0 * n)
    lr = math.radians(lat)
    yt = int((1.0 - math.log(math.tan(lr) + 1 / math.cos(lr)) / math.pi) / 2.0 * n)
    return max(0, min(n - 1, xt)), max(0, min(n - 1, yt))


def fetch_tile(z, x, y, tries=3):
    xmin, ymin, xmax, ymax = tile_bbox(z, x, y)
    q = {'bbox': '%.6f,%.6f,%.6f,%.6f' % (xmin, ymin, xmax, ymax), 'bboxSR': '3857', 'imageSR': '3857',
         'size': '%d,%d' % (TILE, TILE), 'format': 'tiff', 'pixelType': 'F32',
         'interpolation': 'RSP_BilinearInterpolation', 'noDataInterpretation': 'esriNoDataMatchAny', 'f': 'image'}
    url = DEP + '?' + urllib.parse.urlencode(q)
    for i in range(tries):
        try:
            raw = urllib.request.urlopen(url, timeout=120).read()
            if raw[:4] not in (b'II*\x00', b'MM\x00*'):
                raise ValueError('not a tiff (%r)' % raw[:40])
            return np.array(Image.open(io.BytesIO(raw))).astype('float64')
        except Exception as e:
            if i == tries - 1:
                raise
            time.sleep(1.5 * (i + 1))


STEP = 16   # the blue channel quantised to 1/16 m (6 cm)


def terrarium(a):
    """float metres -> terrarium RGB. NoData becomes 0 m, which is what a missing tile would read.

    The fractional (blue) channel is quantised to 1/16 m rather than the full 1/256 m. Six
    centimetres is far below anything a walking camera can feel, and the coarser low bits are what
    make the tile compress: full precision is high-entropy noise and roughly doubles the file.
    """
    a = np.where(np.isfinite(a), a, 0.0)
    a = np.clip(a, -32768.0, 32767.0) + 32768.0
    r = np.floor(a / 256.0)
    g = np.floor(a - r * 256.0)
    b = np.floor((a - np.floor(a)) * 256.0 / STEP) * STEP
    return np.dstack([r, g, b]).astype('uint8')


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--site', default='https://eco-village-map.vercel.app')
    ap.add_argument('--zooms', default='13-17')
    ap.add_argument('--pad', type=float, default=0.25, help='fraction of the property size added on every side')
    ap.add_argument('--only', default='')
    ap.add_argument('--out', default='public/terrain')
    ap.add_argument('--max-tiles', type=int, default=400)
    ap.add_argument('--dry', action='store_true')
    a = ap.parse_args()

    z0, z1 = (int(v) for v in a.zooms.split('-'))
    root = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
    out = os.path.join(root, a.out)
    only = set(s.strip() for s in a.only.split(',') if s.strip())

    with urllib.request.urlopen(a.site + '/api/properties', timeout=60) as r:
        props = json.load(r)

    index = {'schema': 1, 'note': 'USGS 3DEP 1 m elevation, terrarium-encoded, per property. The engine '
             'switches the terrain source to these tiles when the camera is over one of the boxes below.',
             'source': 'USGS 3DEP ImageServer (exportImage, F32 GeoTIFF)',
             'encoding': 'terrarium', 'tileSize': TILE,
             'generated': time.strftime('%Y-%m-%d'), 'minzoom': z0, 'maxzoom': z1, 'areas': []}

    total = 0
    for p in props:
        pid = p['id']
        if only and pid not in only:
            continue
        lats, lons = [], []
        for seg in p.get('boundary') or []:
            for c in seg.get('coordinates') or []:
                lats.append(c[0]); lons.append(c[1])
        for lot in p.get('lots') or []:
            for ring in lot.get('rings') or []:
                for c in ring:
                    lats.append(c[0]); lons.append(c[1])
        if not lats:
            print('%-22s no geometry' % pid); continue
        dlat = (max(lats) - min(lats)) * a.pad
        dlon = (max(lons) - min(lons)) * a.pad
        box = [min(lons) - dlon, min(lats) - dlat, max(lons) + dlon, max(lats) + dlat]

        jobs = []
        for z in range(z0, z1 + 1):
            x0, y1 = lonlat_to_tile(box[0], box[1], z)
            x1, y0 = lonlat_to_tile(box[2], box[3], z)
            for x in range(min(x0, x1), max(x0, x1) + 1):
                for y in range(min(y0, y1), max(y0, y1) + 1):
                    jobs.append((z, x, y))
        print('%-22s %4d tiles  box %.5f,%.5f,%.5f,%.5f' % (pid, len(jobs), *box))
        if len(jobs) > a.max_tiles:
            print('   skipped — over --max-tiles (%d); raise it or lower --zooms' % a.max_tiles)
            continue
        index['areas'].append({'pid': pid, 'bbox': [round(v, 6) for v in box], 'tiles': len(jobs)})
        total += len(jobs)
        if a.dry:
            continue
        done, failed = 0, []
        for (z, x, y) in jobs:
            path = os.path.join(out, pid, str(z), str(x))
            os.makedirs(path, exist_ok=True)
            fp = os.path.join(path, '%d.png' % y)
            if os.path.exists(fp):
                done += 1; continue
            try:
                arr = fetch_tile(z, x, y)
            except Exception as e:
                # 3DEP throws the odd 502 under load. One bad tile is a hole in the surface, not a
                # reason to lose the run - the script skips finished tiles, so re-running fills it.
                failed.append((z, x, y, str(e)[:60]))
                continue
            Image.fromarray(terrarium(arr)).save(fp, optimize=True)
            done += 1
            if done % 25 == 0:
                print('   %d/%d' % (done, len(jobs)))
            time.sleep(0.15)
        print('   %d tiles written%s' % (done, ', %d failed' % len(failed) if failed else ''))
        for f in failed[:5]:
            print('     miss %d/%d/%d  %s' % f)

    if not a.dry:
        os.makedirs(out, exist_ok=True)
        with open(os.path.join(out, 'index.json'), 'w') as f:
            json.dump(index, f, indent=1)
            f.write('\n')
    print('\n%d tiles over %d areas' % (total, len(index['areas'])))


if __name__ == '__main__':
    main()
