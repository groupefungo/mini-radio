<?php
	try {
		$bdd = new PDO('mysql:host=localhost;dbname=radio;charset=utf8', 'root', '');
		$reponse = $bdd->query("SELECT id, callsign, frequency, name, city, url, stream, CONCAT(LOWER(callsign), '.png') as logo FROM stations2 
								WHERE stream <> '' ORDER BY name, city");
		
		$json = json_encode($reponse->fetchAll(PDO::FETCH_ASSOC), JSON_UNESCAPED_SLASHES);
		$jsonFile = fopen("./src/stations.json", "w") or die("Unable to open file!");
		fwrite($jsonFile, $json);
		fclose($jsonFile);
		
		echo "The file has been generated successfully.";
	}
	catch (Exception $e) {
		die('Erreur : ' . $e->getMessage());
	}