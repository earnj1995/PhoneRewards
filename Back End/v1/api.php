<?php
define('API', true);

header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS, HEAD');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With'); 
header('Access-Control-Allow-Origin: *');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS' || $_SERVER['REQUEST_METHOD'] === 'HEAD') {
    exit;
}

$requestURL = explode('/', explode('?', $_SERVER['REQUEST_URI'])[0]);
if($requestURL[0] === '') {
    array_splice($requestURL, 0, 1);
}
while(count($requestURL) > 0 && (strtolower($requestURL[0]) === 'v1' || strtolower($requestURL[0]) === 'api' || strtolower($requestURL[0]) === 'api.php'))
{
    array_splice($requestURL, 0, 1);
}

function error(int $httpCode, string $message, bool $exit = true) {
    http_response_code($httpCode);
    echo(json_encode(array('message' => $message)));
    if($exit) {
        exit;
    }
}

function assertData(array $source, array $data)
{
    $invalidData = array();
    foreach($data as $name => $type)
    {
        $valid = false;
        if(isset($source[$name]))
        {
            switch(strtolower($type))
            {
                case 'integer':
                case 'int':
                    if(is_int($source[$name]))
                        $valid = true;
                    if(is_numeric($source[$name]))
                        $valid = true;
                    break;
                case 'float':
                    if(is_float($source[$name]))
                        $valid = true;
                    if(is_numeric($source[$name]))
                        $valid = true;
                    break;
                case 'latitude':
                    if(is_numeric($source[$name]) && $source[$name] >= -90 && $source[$name] <= 90)
                        $valid = true;
                    break;
                case 'longitude':
                    if(is_numeric($source[$name]) && $source[$name] >= -180 && $source[$name] <= 180)
                        $valid = true;
                    break;
                case 'heading':
                    if(is_numeric($source[$name]) && $source[$name] >= 0 && $source[$name] <= 360)
                        $valid = true;
                    break;
                case 'string':
                    if(is_string($source[$name]))
                        $valid = true;
                    break;
                case 'email':
                    if(filter_var($source[$name], FILTER_VALIDATE_EMAIL))
                        $valid = true;
                    break;
                case 'flight':
                case 'flightNumber':
                    if(is_string($source[$name]) && preg_match('/[A-Z]{3}[A-Z0-9]{1,}/mi', $source[$name]))
                        $valid = true;
                    break;
                case 'airport':
                    if(is_string($source[$name]) && preg_match('/[A-Z]{4}/mi', $source[$name]))
                        $valid = true;
                    break;
                case 'aircraft':
                    if(is_string($source[$name]) && preg_match('/[A-Z]{1}[A-Z0-9]{1,3}/mi', $source[$name]))
                        $valid = true;
                    break;
                case 'airline':
                    if(is_string($source[$name]) && preg_match('/[A-Z]{3}/mi', $source[$name]))
                        $valid = true;
                    break;
                case 'route':
                case 'routePoint':
                case 'waypoint':
                    if(is_string($source[$name]) && preg_match('/((0?[1-9]|[1-2]\\d|3[0-6])[LCR]?)|([A-Z]{5})|([A-Z]{3})|([A-Z]{1-3})/mi', $source[$name]))
                        $valid = true;
                    break;
                case 'phase':
                    if(is_string($source[$name]) && preg_match('/boarding|push_back|taxi|take_off|rejected_take_off|climb_out|climb|cruise|descent|approach|final|landed|go_around|taxi_to_gate|deboarding|diverted/mi', $source[$name]))
                        $valid = true;
                    break;
                case 'network':
                    if(is_string($source[$name]) && preg_match('/offline|vatsim|pilotedge|ivao|poscon/mi', $source[$name]))
                        $valid = true;
                    break;
                case 'status':
                    if(is_string($source[$name]) && preg_match('/accepted|pending|denied/mi', $source[$name]))
                        $valid = true;
                    break;
                case 'array':
                    if(is_array($source[$name]))
                        $valid = true;
                    break;
                case 'json':
                    if(is_string($source[$name]) && json_decode($source[$name]) !== null)
                        $valid = true;
                    break;
                default:
                    $valid = true;
                    break;
            }
        }
        if(!$valid)
            array_push($invalidData, $name . ' (expected `' . $type . '` [Raw Type: `' . gettype($source[$name]) . '`])');
    }

    if(count($invalidData) > 0)
    {
        $message = 'Invalid ';
        if(count($invalidData) > 1)
            $message .= 'types for ';
        else
            $message .= 'type for ';

        $firstItem = true;
        foreach($invalidData as $data)
        {
            if($firstItem)
            {
                $message .= $data;
                $firstItem = false;
            }
            else
                $message .= ', ' . $data;
        }
        error(400, $message);
    }
}

// https://floern.com/;;/is_utf8-check-for-utf8/
function is_utf8($str) {
    $strlen = strlen($str);
    for ($i = 0; $i < $strlen; $i++) {
        $ord = ord($str[$i]);
        if ($ord < 0x80) continue; // 0bbbbbbb
        elseif (($ord & 0xE0) === 0xC0 && $ord > 0xC1) $n = 1; // 110bbbbb (exkl C0-C1)
        elseif (($ord & 0xF0) === 0xE0) $n = 2; // 1110bbbb
        elseif (($ord & 0xF8) === 0xF0 && $ord < 0xF5) $n = 3; // 11110bbb (exkl F5-FF)
        else return false; // invalid UTF-8-Zeichen
        for ($c=0; $c<$n; $c++) // $n following bytes? // 10bbbbbb
            if (++$i === $strlen || (ord($str[$i]) & 0xC0) !== 0x80)
                return false; // invalid UTF-8 char
    }
    return true; // didn't find any invalid characters
}

function ValidateClerkCode()
{
    if(!isset($_GET['clerkcode']) || $_GET['clerkcode'] != CLERK_CODE)
        error(403, 'Invalid clerk code');
}

$apiVersion = '0.1.0';
if(count($requestURL) === 0) {
    echo(json_encode(array('version' => $apiVersion)));
}

require_once('../../resources/api.config.php');
require_once('../../resources/database.php');
$database = Database::GetDatabase();

if($_SERVER['REQUEST_METHOD'] === 'POST' || $_SERVER['REQUEST_METHOD'] === 'DELETE') {
    try {
        $json = json_decode(file_get_contents('php://input'), true);
        if($json !== null && $_SERVER['REQUEST_METHOD'] === 'POST')
            $_POST = $json;
        else if($json !== null && $_SERVER['REQUEST_METHOD'] === 'DELETE')
            $_DELETE = $json;
    }
    catch (Exception $e) {}
}

if(!isset($_GET['storepin']) || $_GET['storepin'] !== STORE_PIN) {
    error(403, 'You are not authorized to access this API');
}

$requiredFile = '';
foreach($requestURL as $fileLocation) {
    if($requiredFile !== '') {
        $requiredFile .= '/';
    }
    $requiredFile .= $fileLocation;
}
if(file_exists('handlers/' . $requiredFile . '.php')) {
    require_once('handlers/' . $requiredFile . '.php');
}
else {
    error(404, 'The handler provided could not be found');
}
?>