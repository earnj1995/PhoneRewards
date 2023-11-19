<?php
if(!defined('API')) die();

ValidateClerkCode();

echo(json_encode(array('success' => true)));
?>