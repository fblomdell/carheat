<?php   
    //hämtar url och kollar vad sista path i URL är
    $url = parse_url($_SERVER['REQUEST_URI']);

    $path = $url['path'];

    $end = basename(parse_url($path, PHP_URL_PATH));


    if($end == "zeromin"){
        getZeroMin($end);

    } elseif ($end != "zeromin"){
        $dir = 'sqlite:carheat.db';
        $db  = new PDO($dir) or die("cannot open the database");

        $query =  "SELECT zeromin FROM heatrise";
        $stmt = $db->query($query);
        $stmt->setFetchMode(PDO::FETCH_ASSOC);
        $result = $stmt->fetchAll();

        foreach ($result as $entry){
            if ($end == $entry['zeromin']){
                getTemprise($end);

            }
        }

    }

    


    //hämtar variabler som skickas med i GET och kollar att det är samma som sista path i url

    


//https://docs.phalconphp.com/en/latest/api/Phalcon_Mvc_Micro.html

    //ta variabeln(tempMinute) och använd den i en fråga till databasen 
    function getZeroMin($zmin){
        $dir = 'sqlite:carheat.db';
        $db  = new PDO($dir) or die("cannot open the database");

        $query =  "SELECT $zmin FROM heatrise";
        $stmt = $db->query($query);
        $stmt->setFetchMode(PDO::FETCH_ASSOC);

        while ($row = $stmt->fetchAll()) {
            echo json_encode(array_values($row));
        }
    }
    
    //ta temperaturen och använd den för att hämta temphöjningen från databasen
    function getTemprise($getTemp){
        $dir = 'sqlite:carheat.db';
        $db  = new PDO($dir) or die("cannot open the database");

        $query =  "SELECT * FROM heatrise where zeromin=$getTemp";
        $stmt = $db->query($query);
        $stmt->setFetchMode(PDO::FETCH_ASSOC);

        while ($row = $stmt->fetchAll()) {
            echo json_encode(array_values($row));
        }
    }


    
?>