<?php

class File {
    private $stream;
    public function __construct($stream) {
        $this->stream = $stream
    }
    
    public function nextLine() {
        return fgets($stream);
    }
    
    public function hasNext() {
        return !feof($stream);
    }
    
    public function close() {
        @fclose($stream);
    }
}
