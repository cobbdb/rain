<?php

/**
 * station.php
 * 
 * @author Dan Cobb
 * @since 1.3.0
 * @date September 18, 2012
 */

/**
 * @description lkj
 */
class Station {
    public $station_id, $lat, $lng, $dist;
    
    private $sums;
    private $counts;
    
    
    function __construct($in_id, $in_lat, $in_lng, $in_dist) {
        $this->station_id = $in_id;
        $this->lat = $in_lat;
        $this->lng = $in_lng;
        $this->dist = $in_dist;
        
        for ($i = 0; $i < 12; $i += 1) {
            $this->sums[] = 0;
            $this->counts[] = 0;
        }
    }
    
    // $mo_num is a calendar number -> [1,12]
    function addRainfall($mo_num, $val) {
        // decrement to month index
        $mo_num -= 1;
        
        $this->sums[$mo_num] += $val;
        $this->counts[$mo_num] += 1;
    }
    
    // $mo_num is a calendar number -> [1,12]
    function getMonthlyMean($mo_num) {
        $mo_num -= 1;
        
        if ($this->counts[$mo_num] == 0) {
            // no data
            $ave = -99; // error code
        } else {
            $ave = $this->sums[$mo_num];
            $ave /= $this->counts[$mo_num];
            $ave /= 10; // convert to mm
            // don't need fractions of a millimetre
            $ave = round($ave);
        }
        
        return $ave;
    }
    
    function getYearlyMean() {
        $ave = 0;
        for ($i=0; $i<12; $i += 1) {
            $m_ave = $this->getMonthlyMean($i + 1);
            if ($m_ave == -99) {
                $ave = -99; // error: incomplete data
                break;
            } else {
                $ave += $m_ave;
            }
        }
        
        return $ave;
    }
}
