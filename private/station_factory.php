<?php

/**
 * Creates stations from line of meta data.
 */
class StationFactory {
    public static function newStation($line) {
        $tokens = preg_split('/[\s]+/', $line);
        $len = count($tokens);
        
        // First data is station id.
        $station_id = $tokens[0];
        // 3rd and 2nd to last are lat/lng coords.
        $lat = $tokens[$len - 3];
        $lng = $tokens[$len - 2];
        
        // find distance to coords
        global $in_lat, $in_lng;
        $dist = self::findDistance($in_lat, $in_lng, $lat, $lng);
        
        return new Station($station_id, $lat, $lng, $dist);
    }
    
    /**
     * @returns {Number} Distance in kilometers.
     * @see http://www.johndcook.com/python_longitude_latitude.html
     */
    private static function findDistance($lat1, $lng1, $lat2, $lng2) {
        $deg2rad = pi() / 180;
        
        $phi1 = (90 - $lat1) * $deg2rad;
        $phi2 = (90 - $lat2) * $deg2rad;
        
        $theta1 = $lng1 * $deg2rad;
        $theta2 = $lng2 * $deg2rad;
        
        $cos = (
            sin($phi1) * sin($phi2) * cos($theta1 - $theta2) +
            cos($phi1) * cos($phi2)
        );
        $arc = acos($cos);
        // 6373 is magic number from algorithm's source. See link above.
        return round($arc * 6373, 2);
    }
}
