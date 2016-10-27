<?php
    //om variabeln name är skickat med POST från JS, exekvera kod
    if(isset($_POST["tempMinute"])){
        $zmin = htmlspecialchars($_POST["tempMinute"]);
        getZeroMin($zmin);
    }
    
    //om variabeln getTemp är skickat med POST från JS, exekvera kod
    if(isset($_POST["getTemprise"])){
        $getTemp = htmlspecialchars($_POST["getTemprise"]);
        getTemprise($getTemp);
    }

    //ta den postade variabeln(zeromin) och använd den i en fråga till databasen 
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
    
    //ta den postade temperaturen och använd den för att hämta temphöjningen från databasen
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