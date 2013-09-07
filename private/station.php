<?php

/**
 * Stations may contain data points from many years of
 * rainfall measurements. Not all years have rainfall data
 * for every month.
 * TODO: throw exception instead of silent return of error codes.
 * TODO: Desperately needs static class Month with enums.
 */
class Station {
    public $station_id, $lat, $lng, $dist;

    private $sums;
    private $counts;

    public function __construct($id, $lat, $lng, $dist) {
        $this->station_id = $id;
        $this->lat = $lat;
        $this->lng = $lng;
        $this->dist = $dist;

        for ($i = 0; $i < 12; $i += 1) {
            $this->sums[] = 0;
            $this->counts[] = 0;
        }
    }

    /**
     * Add rainfall data point to a month.
     * @param {Number} no_num Month's calendar number [1,12].
     * @param {Number} val Rainfall amount in cm.
     */
    public function addRainfall($mo_num, $val) {
        // decrement to month index
        $mo_num -= 1;

        $this->sums[$mo_num] += $val;
        $this->counts[$mo_num] += 1;
    }

    /**
     * Calculate mean rainfall in mm for a month.
     * @param {Number} mo_num Month's calendar number [1,12].
     * @returns {Number} Mean rainfall in mm.
     */
    public function getMonthlyMean($mo_num) {
        $index = $mo_num - 1;

        // Error if no data points for this month.
        if ($this->counts[$index] == 0) {
            return -99; // error code
        }

        $ave = $this->sums[$index];
        $ave /= $this->counts[$index];
        $ave /= 10; // convert to mm
        // don't need fractions of a millimetre
        return round($ave);
    }

    /**
     * Calculate mean rainfall in mm for a year.
     * @return {Number} Mean rainfall in mm.
     */
    public function getYearlyMean() {
        $ave = 0;
        for ($i=0; $i<12; $i += 1) {
            $m_ave = $this->getMonthlyMean($i + 1);
            // Error if any month has no data points.
            if ($m_ave == -99) {
                return -99; // error code
            }
            $ave += $m_ave;
        }
        return $ave;
    }
}
