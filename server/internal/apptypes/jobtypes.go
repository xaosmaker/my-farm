package apptypes

func JobTypesWithSupplies() []string {
	return []string{
		"spraying",    //Ψεκασμός
		"fertilizing", //Λίπανση
		"sowing",      //Σπορά
		"harvesting",  //Συγκομιδή
		"planting",    //Φύτευση
	}

}

func JobTypes() []string {
	return []string{
		"spraying",          //"Ψεκασμός"
		"drone spraying",    //"Ψεκασμός drone"
		"fertilizing",       //"Λίπανση"
		"sowing",            //"Σπορά"
		"harvesting",        //"Συγκομιδή"
		"planting",          //"Φύτευση"
		"irrigation",        //"πότισμα",
		"pruning",           //"κλάδεμα",
		"hoeing",            //"τσάπισμα",
		"preparation",       //"προετοιμασία",
		"plowing",           //"όργωμα",
		"leveling",          //"ισοπέδωμα",
		"tilling",           //"φρέζα",
		"cultivator",        //"σκαλιστήρι",
		"rotary cultivator", //"φρεζοσκαλιστήρι",
		"subsoiler",         //"ρίπερ",
		"harrowing",         //"δισκοσβάρνα",
	}
}
