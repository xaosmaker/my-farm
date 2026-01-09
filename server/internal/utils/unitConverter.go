package utils

func UnitConverter(landUnit string) int {
	switch landUnit {
	case "stremata":
		return 1000
	case "hectares":
		return 10000
	default:
		return 1
	}

}
