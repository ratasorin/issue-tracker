import json
import geojson
from functools import partial
import pyproj
import shapely.geometry
import shapely.ops
import os

# Get the absolute path to the directory containing the script
script_dir = os.getcwd()

# reading into two geojson objects, in a GCS (WGS84)
with open(os.path.join(script_dir, "public/map.json")) as geojson1:
    poly1_geojson = json.load(geojson1)

with open(os.path.join(script_dir, "public/timisoara.json")) as geojson2:
    poly2_geojson = json.load(geojson2)

# pulling out the polygons
poly1 = shapely.geometry.shape(poly1_geojson['features'][0]['geometry'])
poly2 = shapely.geometry.shape(poly2_geojson['features'][0]['geometry'])

# checking to make sure they registered as polygons
print(poly1.geom_type)
print(poly2.geom_type)

# merging the polygons - they are feature collections, containing a point, a polyline, and a polygon - I extract the polygon
# for my purposes, they overlap, so merging produces a single polygon rather than a list of polygons
mergedPolygon = poly1.difference(poly2)

print(mergedPolygon)

# using geojson module to convert from WKT back into GeoJSON format
geojson_out = geojson.Feature(geometry=mergedPolygon, properties={})

# outputting the updated geojson file - for mapping/storage in its GCS format
with open(os.path.join(script_dir, "public/outline_map.json"), 'w') as outfile:
    json.dump(geojson_out.geometry, outfile, indent=3)
outfile.close()

# reprojecting the merged polygon to determine the correct area
# it is a polygon covering much of the US, and dervied form USGS data, so using Albers Equal Area
project = partial(
    pyproj.transform,
    pyproj.Proj(init='epsg:4326'),
    pyproj.Proj(init='epsg:5070'))

mergedPolygon_proj = shapely.ops.transform(project, mergedPolygon)
