class Unit {
  constructor(id, country, type, name, points, elan, min, max, ammo, special) {
    this.id=id;
    this.country=country;
    this.type=type;
    this.name=name;
    this.points=points;
    this.elan=elan;
    this.min=min;
    this.max=max;
    this.ammo=ammo;
    this.special=special;
    this.count = 0;      
  }
}

class Column {
  constructor(id) {
    this.id = id;
    this.units = [];
    this.numberOfType = [];
    this.totalUnits = 0;
    this.totalPoints = 0;
    //this.addUnit = this.addUnit.bind(this);
    //this.removeUnit = this.removeUnit.bind(this);
    //this.clearColumn = this.clearColumn.bind(this);
  }

  addUnit(unit, index, myArmy) {
    // commander and subcommander is unique, maximum 1 count
    if (unit.type === "commander" || unit.type === "subcommander") {
      if (myArmy.unitsAvailable[index].count > 0) {
        return
      }
    }
    // allow only one general for ottomans
    if (myArmy.country === "ottoman" && unit.type === "commander") {
      if (myArmy.unitsAvailable[0].count + myArmy.unitsAvailable[1].count  > 0) {
        return
      }
    }
    this.units.push(unit);
    this.numberOfType[index]++;
    myArmy.unitsAvailable[index].count++;
    this.totalPoints = this.totalPoints + unit.points;
    this.units.sort((a,b) => a.id-b.id);
    myArmy.totalPoints += unit.points;
    // special and commander don't count for total units. therefore skip last two lines
    if (unit.type === "special" || unit.type === "commander" || unit.type === "subcommander") {
      return
    }
    myArmy.totalUnits += 1;
    this.totalUnits += 1;
    //this.totalUnits = this.units.length;
  }

  removeUnit(myArmy, unit) {
    Object.setPrototypeOf(unit, Unit.prototype);
    for (let i=0; i<myArmy.unitsAvailable.length; i++) {
      if (myArmy.unitsAvailable[i].id == unit.id) {
        this.numberOfType[i]--;
        myArmy.unitsAvailable[i].count--;
        this.totalPoints = this.totalPoints - unit.points;

        for (let k=0; k<this.units.length; k++) {
          //const positionInColumn = this.units.indexOf(unit); does not work because after load a new object is created and indexOf()
          // checks for same reference;
          // determine index of position of unit in units array
          if (this.units[k].id == unit.id) {
            // removes unit at position k from array
            this.units.splice(k, 1);
            break;
          }
        }
        myArmy.totalPoints -= unit.points;
        // special and commander don't count for total units. therefore skip last two lines
        if (unit.type === "special" || unit.type === "commander" || unit.type === "subcommander") {
          return
        }
        myArmy.totalUnits -= 1;
        this.totalUnits -= 1;
        //this.totalUnits = this.units.length;
        return;
      }
    }
  }


  clearColumn(myArmy) {

    for (let i = 0; i < myArmy.unitsAvailable.length; i++) {
      // remove column total of type from army total of type
      myArmy.unitsAvailable[i].count -= this.numberOfType[i];
      this.numberOfType[i] = 0;
    }
    this.units = [];
    myArmy.totalPoints -= this.totalPoints;
    myArmy.totalUnits -= this.totalUnits;
    this.totalUnits = 0;
    this.totalPoints = 0;
    // if added units is prussian late infantry, adjust the max for mixed brigade and landwehr shock specials
  }
}


class Army {
  constructor(id, country, name, unitsAvailable, maxSubcommander) {
    this.id = id;
    this.country = country;
    this.name = name;
    this.unitsAvailable = unitsAvailable;
    this.columns = [];
    this.activeIndex = 0;
    this.totalUnits = 0;
    this.totalPoints = 0;
    this.maxSubcommander = maxSubcommander;
    this.description = "";
    //this.addColumn = this.addColumn.bind(this);
    //this.removeColumn = this.removeColumn.bind(this);
  }

  addColumn() {
    let column = new Column(this.columns.length);
    // fill the new column with 0 for the number each unit type
    for (let i = 0; i < this.unitsAvailable.length; i++) {
      column.numberOfType[i] = 0;
    } 
    this.columns.push(column);
    this.activeIndex = this.columns.length -1;
  }

  removeColumn() {
    if (this.columns.length > 0) {
      for (let i = 0; i < this.unitsAvailable.length; i++) {
         //remove column total of type from army total of type
        this.unitsAvailable[i].count -= this.columns[this.activeIndex].numberOfType[i];
      }
      this.totalPoints -= this.columns[this.activeIndex].totalPoints;
      this.totalUnits -= this.columns[this.activeIndex].totalUnits;
      //this.columns[this.activeIndex].totalPoints = 0;
      //this.columns[this.activeIndex].totalUnits = 0;
      //removes active element from array
      this.columns.splice(this.activeIndex, 1);
      if (this.activeIndex >= this.columns.length && this.activeIndex > 0) {
        this.activeIndex = this.columns.length - 1;
      }
    }
  }
}
  

var austrian_com1 = new Unit(0, "austrian", "commander", "Archduke Charles", 25, "", "", "", "", "Mobile");
var austrian_sub1 = new Unit(1, "austrian", "subcommander", "Michael von Kienmayer", 15, "", "", "", "", "Cavalry, Hero");
var austrian_sub2 = new Unit(2, "austrian", "subcommander", "Heinrich von Bellegarde", 10, "", "", "", "", "Inspiring");
var austrian_sub3 = new Unit(3, "austrian", "subcommander", "Johann von Klenau", 5, "", "", "", "", "Steadfast");
var austrian_grenadiers = new Unit(4, "austrian", "infantry", "Grenadiers", 16, 7, "", 4, "", "Steady, Shock");
var austrian_veteran_grenz = new Unit(5, "austrian", "infantry", "Veteran Grenz Regiment", 12, 6, "", 4, "", "Skirmish");
var austrian_avant_garde= new Unit(6, "austrian", "infantry", "Avant-Garde Brigade", 14, 6, "", 4, "", "Skirmish, Mixed Brigade");
var austrian_veteran_infantry= new Unit(7, "austrian", "infantry", "Veteran Infantry Regiment", 10, 6, 2, "", "", "");
var austrian_conscripts= new Unit(8, "austrian", "infantry", "Conscripts, Grenz Infantry", 9, 6, 2, "", "", "Conscript");
var austrian_landwehr= new Unit(9, "austrian", "infantry", "Landwehr", 6, 5, "", 4, "", "Conscript");
var austrian_cuirassiers= new Unit(10, "austrian", "cavalry", "Cuirassiers", 15, 7, "", 4, "", "Shock");
var austrian_hussars= new Unit(11, "austrian", "cavalry", "Hussars", 14, 7, "", 4, "", "");
var austrian_other_cavalry= new Unit(12, "austrian", "cavalry", "Other Cavalry", 10, 6, "", 4, "", "");
var austrian_insurrection= new Unit(13, "austrian", "cavalry", "Insurrection", 3, 4, "", 2, "", "Impetuous");
var austrian_foot_artillery = new Unit(14, "austrian", "artillery", "Foot Artillery", 6, "", "", 4, "5-4-4-3-2-2", "");
var austrian_horse_artillery = new Unit(15, "austrian", "artillery", "Horse Artillery", 9, "", "", 3, "5-4-4-3-2-2", "Mobile");
var austrian_heavy_artillery = new Unit(16, "austrian", "artillery", "Heavy Artillery", 9, "", "", 2, "5-4-4-3-2-2", "Heavy ART");

var british_hd_com1 = new Unit(17, "british", "commander", "Wellington", 40, "", "", "", "", "Mobile, Intuitive");
var british_hd_sub1 = new Unit(18, "british", "subcommander", "Friedrich Wilhelm", 5, "", "", "", "", "Hero");
var british_hd_sub2 = new Unit(19, "british", "subcommander", "Rowland Hill", 10, "", "", "", "", "Inspiring");
var british_hd_sub3 = new Unit(20, "british", "subcommander", "Thomas Picton", 10, "", "", "", "", "Hero");
var british_hd_sub4 = new Unit(21, "british", "subcommander", "Robert Craufurd", 15, "", "", "", "", "Vigorous");
var british_hd_foot_guards = new Unit(22, "british", "infantry", "Foot Guards", 20, 7, "", 2, "", "Firepower, Skirmish, Steady, Shock");
var british_hd_light_infantry = new Unit(23, "british", "infantry", " Light Infantry", 21, 7, "", 0, "", "Firepower, Skirmish, Steady, Mobile");
var british_hd_elite_infantry = new Unit(24, "british", "infantry", "Elite Infantry", 19, 7, "", 1, "", "Firepower, Skirmish, Steady");
var british_hd_foot_regiments = new Unit(25, "british", "infantry", "Foot Regiment / KGL", 15, 6, 4, "", "", "Firepower, Skirmish, Steady");
var british_hd_guard_horse = new Unit(26, "british", "cavalry", "Guard Horse, Hvy Dragoons", 14, 7, "", 2, "", "Shock, Impetuous");
var british_hd_light_cavalry = new Unit(27, "british", "cavalry", "Light Cavalry", 10, 6, "", 2, "", "Shock, Impetuous");
var british_hd_foot_artillery = new Unit(28, "british", "artillery", "Foot Artillery", 6, "", "", 2, "5-4-4-3-2-2", "");
var british_hd_horse_artillery = new Unit(29, "british", "artillery", "Horse Artillery", 9, "", "", 1, "5-4-4-3-2-2", "Mobile");
var british_hd_heavy_artillery = new Unit(30, "british", "artillery", "Heavy Artillery", 9, "", "", 1, "5-4-4-3-2-2", "Heavy ART");
var british_hd_brunswickers = new Unit(31, "british", "allies", "Brunswickers", 12, 6, "", 2, "", "Skirmish");
var british_hd_dutch_belgian = new Unit(32, "british", "allies", "Dutch-Belgian", 8, 5, "", 6, "", "Skirmish, Conscript");
var british_hd_dutch_militia = new Unit(33, "british", "allies", "Dutch, Hanoverian Militia", 6, 5, "", 4, "", "Conscript");
var british_hd_nassauers = new Unit(34, "british", "allies", "Nassauers", 12, 6, "", 1, "", "Skirmish");
var british_hd_brunswick_cavalry = new Unit(35, "british", "allies", "Brunswick Cavalry", 10, 6, "", 1, "", "");
var british_hd_dutch_cavalry = new Unit(36, "british", "allies", "Dutch-Belgian Cavalry", 7, 5, "", 4, "", "");

var british_com1 = new Unit(37, "british", "commander", "Wellington", 40, "", "", 1, "", "Mobile, Intuitive");
var british_sub1 = new Unit(38, "british", "subcommander", "Friedrich Wilhelm", 5, "", "", "", "", "Hero");
var british_sub2 = new Unit(39, "british", "subcommander", "Rowland Hill", 10, "", "", "", "", "Inspiring");
var british_sub3 = new Unit(40, "british", "subcommander", "Robert Craufurd", 10, "", "", "", "", "Vigorous");
var british_sub4 = new Unit(41, "british", "subcommander", "Thomas Picton", 10, "", "", "", "", "Hero");
var british_foot_guards = new Unit(42, "british", "infantry", "Foot Guards", 20, 7, "", 2, "", "Firepower, Skirmish, Steady, Shock");
var british_light_infantry = new Unit(43, "british", "infantry", " Light Infantry", 21, 7, "", 1, "", "Firepower, Skirmish, Steady, Mobile");
var british_elite_infantry = new Unit(44, "british", "infantry", "Elite Infantry", 19, 7, "", 1, "", "Firepower, Skirmish, Steady");
var british_foot_regiments = new Unit(45, "british", "infantry", "Foot Regiment / KGL", 15, 6, 4, "", "", "Firepower, Skirmish, Steady");
var british_guard_horse = new Unit(46, "british", "cavalry", "Guard Horse, Hvy Dragoons", 14, 7, "", 2, "", "Shock, Impetuous");
var british_light_cavalry = new Unit(47, "british", "cavalry", "Light Cavalry", 10, 6, "", 2, "", "Shock, Impetuous");
var british_foot_artillery = new Unit(48, "british", "artillery", "Foot Artillery", 6, "", "", 2, "5-4-4-3-2-2", "");
var british_horse_artillery = new Unit(49, "british", "artillery", "Horse Artillery", 9, "", "", 1, "5-4-4-3-2-2", "Mobile");
var british_heavy_artillery = new Unit(50, "british", "artillery", "Heavy Artillery", 9, "", "", 1, "5-4-4-3-2-2", "Heavy ART");
var british_brunswickers = new Unit(51, "british", "allies", "Brunswickers", 12, 6, "", 2, "", "Skirmish");
var british_veteran_portuguese = new Unit(52, "british", "allies", "Veteran Portuguese", 12, 6, "", 3, "", "Skirmish");
var british_portuguese = new Unit(53, "british", "allies", "Portuguese", 8, 5, "", 3, "", "Skirmish, Conscript");
var british_spanish_infantry = new Unit(54, "british", "allies", "Spanish Infantry", 7, 5, "", 4, "", "");
var british_spanish_provincal = new Unit(55, "british", "allies", "Spanish Provincial Infantry", 6, 5, "", 4, "", "Conscript");
var british_brunswick_cavalry = new Unit(56, "british", "allies", "Brunswick Cavalry", 10, 6, "", 1, "", "");
var british_portuguese_cavalry = new Unit(57, "british", "allies", "Portuguese Cavalry", 3, 4, "", 1, "", "Impetuous");
var british_spanish_light_cavalry = new Unit(58, "british", "allies", "Spanish Light Cavalry", 6, 5, "", 2, "", "Impetuous");
var british_spanish_irregular_cavalry = new Unit(59, "british", "allies", "Spanish Irregular Cavalry", 4, 4, "", 2, "", "");

var frenchearly_com1 = new Unit(60, "frenchearly", "commander", "Napoleon", 30, "", "", "", "", "Legend, Staffwork");
var frenchearly_sub1 = new Unit(61, "frenchearly", "subcommander", "Louis-Nicolas Davout", 15, "", "", "", "", "Vigorous");
var frenchearly_sub2 = new Unit(62, "frenchearly", "subcommander", "Antoine Drouot", 5, "", "", "", "", "Artillery");
var frenchearly_sub3 = new Unit(63, "frenchearly", "subcommander", "Jean Lannes", 10, "", "", "", "", "Inspiring");
var frenchearly_sub4 = new Unit(64, "frenchearly", "subcommander", "Michel Ney", 10, "", "", "", "", "Hero");
var frenchearly_sub5 = new Unit(65, "frenchearly", "subcommander", "Joachim Murat", 15, "", "", "", "", "Cavalry, Inspiring");
var frenchearly_sub6 = new Unit(66, "frenchearly", "subcommander", "Eugene de Beauharnais", 15, "", "", "", "", "Vigorous");
var frenchearly_sub7 = new Unit(67, "frenchearly", "subcommander", "Francois Kellerman", 15, "", "", "", "", "Cavalry, Hero");
var frenchearly_sub8 = new Unit(68, "frenchearly", "subcommander", "Jozef Poniatowski", 10, "", "", "", "", "Hero");
var frenchearly_old_guard = new Unit(69, "frenchearly", "infantry", "Old Guard", 22, 8, "", 2, "", "Skirmish, Steady, Shock");
var frenchearly_guard_infantry = new Unit(70, "frenchearly", "infantry", "Guard Infantry", 18, 7, "", 4, "", "Skirmish, Steady, Shock");
var frenchearly_elite_infantry = new Unit(71, "frenchearly", "infantry", "Elite Infantry", 16, 7, "", 2, "", "Skirmish");
var frenchearly_line_infantry= new Unit(72, "frenchearly", "infantry", "Line Infantry", 12, 6, 4, "", "", "Skirmish");
var frenchearly_guard_cavalry = new Unit(73, "frenchearly", "cavalry", "Guard Cavalry", 19, 8, "", 2, "", "Shock");
var frenchearly_cuirassiers = new Unit(74, "frenchearly", "cavalry", "Cuirassiers", 15, 7, "", 4, "", "Shock");
var frenchearly_dragoons = new Unit(75, "frenchearly", "cavalry", "Dragoons", 11, 6, "", 4, "", "Shock");
var frenchearly_light_cavalry = new Unit(76, "frenchearly", "cavalry", "Light Cavalry", 10, 6, "", 6, "", "");
var frenchearly_foot_artillery = new Unit(77, "frenchearly", "artillery", "Foot Artillery", 6, "", "", 4, "5-4-4-3-2-2", "");
var frenchearly_horse_artillery = new Unit(78, "frenchearly", "artillery", "Horse Artillery", 9, "", "", 2, "5-4-4-3-2-2", "Mobile");
var frenchearly_heavy_artillery = new Unit(79, "frenchearly", "artillery", "Heavy Artillery", 9, "", "", 3, "5-4-4-3-2-2", "Heavy ART");
var guardearly_foot_artillery = new Unit(80, "frenchearly", "artillery", "Guard Foot Artillery", 9, "", "", 2, "6-5-5-4-3-3", "");
var guardearly_horse_artillery = new Unit(81, "frenchearly", "artillery", "Guard Horse Artillery", 12, "", "", 2, "6-5-5-4-3-3", "Mobile");
var guardearly_heavy_artillery = new Unit(82, "frenchearly", "artillery", "Guard Heavy Artillery", 12, "", "", 2, "6-5-5-4-3-3", "Heavy ART");
var frenchearly_allied_elite= new Unit(83, "frenchearly", "allies", "Elite Infantry", 17, 7, "", 2, "", "Skirmish, Steady");
var frenchearly_polish_infantry= new Unit(84, "frenchearly", "allies", "Polish Infantry", 13, 6, "", 4, "", "Skirmish, Shock");
var frenchearly_french_model= new Unit(85, "frenchearly", "allies", "French Model Infantry", 12, 6, "", 4, "", "Skirmish");
var frenchearly_other_infantry= new Unit(86, "frenchearly", "allies", "Other Allied Infantry", 10, 6, "", 4, "", "");
var frenchearly_conscripts= new Unit(87, "frenchearly", "allies", "Conscripts", 6, 5, "", 4, "", "Conscript");
var frenchearly_elite_cavalry = new Unit(88, "frenchearly", "allies", "Elite Cavalry", 15, 7, "", 1, "", "Shock");
var frenchearly_polish_cavalry = new Unit(89, "frenchearly", "allies", "Polish Cavalry", 11, 6, "", 2, "", "Shock");
var frenchearly_allied__cavalry = new Unit(90, "frenchearly", "allies", "Allied Cavalry", 10, 6, "", 2, "", "");
var frenchearly_poor_cavalry= new Unit(91, "frenchearly", "allies", "Poor Cavalry", 7, 5, "", 2, "", "");

var frenchlate_com1 = new Unit(92, "frenchlate", "commander", "Napoleon", 20, "", "", "", "", "Legend");
var frenchlate_sub1 = new Unit(93, "frenchlate", "subcommander", "Laurent Gouvion de St. Cyr", 5, "", "", "", "", "Steadfast");
var frenchlate_sub2 = new Unit(94, "frenchlate", "subcommander", "Antoine Drouot", 5, "", "", "", "", "Artillery");
var frenchlate_sub3 = new Unit(95, "frenchlate", "subcommander", "Auguste Marmont", 15, "", "", "", "", "Vigorous");
var frenchlate_sub4 = new Unit(96, "frenchlate", "subcommander", "Michel Ney", 10, "", "", "", "", "Hero");
var frenchlate_sub5 = new Unit(97, "frenchlate", "subcommander", "Edouard Mortier", 10, "", "", "", "", "Hero");
var frenchlate_sub6 = new Unit(98, "frenchlate", "subcommander", "Francois Kellerman", 15, "", "", "", "", "Cavalry, Hero");
var frenchlate_old_guard = new Unit(99, "frenchlate", "infantry", "Old Guard", 22, 8, "", 2, "", "Skirmish, Steady, Shock");
var frenchlate_guard_infantry = new Unit(100, "frenchlate", "infantry", "Guard Infantry", 18, 7, "", 8, "", "Skirmish, Steady, Shock");
var frenchlate_veteran_infantry= new Unit(101, "frenchlate", "infantry", "Veteran Infantry", 12, 6, "", 4, "", "Skirmish");
var frenchlate_conscripts = new Unit(102, "frenchlate", "infantry", "Conscript Infantry", 9, 5, 4, "", "", "Skirmish, Conscript, Shock");
var frenchlate_guard_cavalry = new Unit(103, "frenchlate", "cavalry", "Guard Cavalry", 15, 7, "", 2, "", "Shock");
var frenchlate_heavy_cavalry = new Unit(104, "frenchlate", "cavalry", "Heavy Cavalry, Dragoons", 10, 6, "", 3, "", "");
var frenchlate_light_cavalry = new Unit(105, "frenchlate", "cavalry", "Light Cavalry", 7, 5, "", 3, "", "");
var frenchlate_foot_artillery = new Unit(106, "frenchlate", "artillery", "Foot Artillery", 6, "", "", 6, "5-4-4-3-2-2", "");
var frenchlate_horse_artillery = new Unit(107, "frenchlate", "artillery", "Horse Artillery", 9, "", "", 4, "5-4-4-3-2-2", "Mobile");
var frenchlate_heavy_artillery = new Unit(108, "frenchlate", "artillery", "Heavy Artillery", 9, "", "", 4, "5-4-4-3-2-2", "Heavy ART");
var guardlate_foot_artillery = new Unit(109, "frenchlate", "artillery", "Guard Foot Artillery", 7, "", "", 4, "6-5-5-4-3-3", "");
var guardlate_horse_artillery = new Unit(110, "frenchlate", "artillery", "Guard Horse Artillery", 10, "", "", 4, "6-5-5-4-3-3", "Mobile");
var guardlate_heavy_artillery = new Unit(111, "frenchlate", "artillery", "Guard Heavy Artillery", 10, "", "", 4, "6-5-5-4-3-3", "Heavy ART");
var frenchlate_allied_veteran= new Unit(112, "frenchlate", "allies", "Veteran Infantry", 12, 6, "", 2, "", "Skirmish");
var frenchlate_allied_conscript= new Unit(113, "frenchlate", "allies", "Conscript Infantry", 6, 5, "", 4, "", "Conscript");
var frenchlate_allied_cav = new Unit(114, "frenchlate", "allies", "Allied Cavalry", 7, 5, "", 2, "", "");

var ottoman_com1 = new Unit(115, "ottoman", "commander", "Muhammad-Ali", 30, "", "", "", "", "Legend");
var ottoman_com2 = new Unit(116, "ottoman", "commander", "Ali of Janina", 30, "", "", "", "", "Intuitive");
var ottoman_sub1 = new Unit(117, "ottoman", "subcommander", "Hoursid Pasha", 15, "", "", "", "", "Vigorous");
var ottoman_sub2 = new Unit(118, "ottoman", "subcommander", "Koca Hüsrev Pasha", 10, "", "", "", "", "Inspiring");
var ottoman_sub3 = new Unit(119, "ottoman", "subcommander", "Mustafa Bairakdar", 10, "", "", "", "", "Hero");
var ottoman_elite_jan = new Unit(120, "ottoman", "infantry", "Elite Janissaries", 17, 7, "", 2, "", "Skirmish, Shock");
var ottoman_vet_jan = new Unit(121, "ottoman", "infantry", "Veteran Janissaries", 12, 6, "", 4, "", "Skirmish, Shock, Impetuous");
var ottoman_con_jan = new Unit(122, "ottoman", "infantry", "Conscript Janissaries", 6, 5, 3, "", "", "Shock, Conscript, Impetuous");
var ottoman_prov_inf = new Unit(123, "ottoman", "infantry", "Provincial Infantry", 7, 5, 3, "", "", "Skirmish, Conscript, Impetuous");
var ottoman_nizam = new Unit(124, "ottoman", "infantry", "Nizam e Cedid", 11, 6, "", 4, "", "Steadfast");
var ottoman_reg_cav = new Unit(125, "ottoman", "cavalry", "Regular Cavalry", 9, 6, "", 12, "", "Impetuous");
var ottoman_irr_cav = new Unit(126, "ottoman", "cavalry", "Irregular Cavalry", 7, 5, "", 12, "", "Impetuous, Recon no Fatigue");
var ottoman_irr_cav_norecon = new Unit(127, "ottoman", "cavalry", "Irregular Cavalry", 6, 5, "", 12, "", "Impetuous");
var ottoman_foot_artillery = new Unit(128, "ottoman", "artillery", "Foot Artillery", 6, "", "", 3, "5-4-4-3-2-2", "");
var ottoman_heavy_artillery = new Unit(129, "ottoman", "artillery", "Heavy Artillery", 9, "", "", 3, "5-4-4-3-2-2", "Heavy ART");

var prussianearly_sub1 = new Unit(130, "prussianearly", "subcommander", "Gebhard von Blücher", 15, "", "", "", "", "Cavalry, Vigorous");
var prussianearly_sub2 = new Unit(131, "prussianearly", "subcommander", "Louis Ferdinand", 10, "", "", "", "", "Cavalry, Inspiring");
var prussianearly_sub3 = new Unit(132, "prussianearly", "subcommander", "Anton von L'Estocq", 5, "", "", "", "", "Steadfast");
var prussianearly_guards = new Unit(133, "prussianearly", "infantry", "Guards, Grenadiers", 18, 7, "", 4, "", "Firepower, Steady, Shock");
var prussianearly_avant = new Unit(134, "prussianearly", "infantry", "Avant-Garde Brigade", 14, 6, "", 4, "", "Skirmish, Mixed Brigade");
var prussianearly_inf = new Unit(135, "prussianearly", "infantry", "Infantry Brigade", 12, 6, 4, "", "", "Firepower");
var prussianearly_hvy_cav = new Unit(136, "prussianearly", "cavalry", "Heavy Cavalry", 15, 7, "", 6, "", "Shock");
var prussianearly_light_cav = new Unit(137, "prussianearly", "cavalry", "Light Cavalry", 11, 6, "", 6, "", "Shock");
var prussianearly_foot_art = new Unit(138, "prussianearly", "artillery", "Foot Artillery", 6, "", "", 1, "5-4-4-3-2-2", "");
var prussianearly_horse_art = new Unit(139, "prussianearly", "artillery", "Horse Artillery", 9, "", "", 2, "5-4-4-3-2-2", "Mobile");
var prussianearly_hvy_art = new Unit(140, "prussianearly", "artillery", "Heavy Artillery", 9, "", "", 1, "5-4-4-3-2-2", "Heavy ART");
var prussianearly_ally_guard = new Unit(141, "prussianearly", "allies", "Saxon Guards, Grenadiers", 11, 6, "", 2, "", "Steady");
var prussianearly_ally_inf = new Unit(142, "prussianearly", "allies", "Saxon Infantry", 7, 5, "", 4, "", "");
var prussianearly_ally_cav = new Unit(143, "prussianearly", "allies", "Saxon Heavy Cavalry", 15, 7, "", 6, "", "Shock");

var prussianlate_com1 = new Unit(144, "prussianlate", "commander", "Gebhard von Blücher", 30, "", "", "", "", "Legend, Mobile");
var prussianlate_sub1 = new Unit(145, "prussianlate", "subcommander", "Johann von Thielemann", 5, "", "", "", "", "Steadfast");
var prussianlate_sub2 = new Unit(146, "prussianlate", "subcommander", "L. Yorck von Wartenburg", 10, "", "", "", "", "Hero");
var prussianlate_sub3 = new Unit(147, "prussianlate", "subcommander", "Friedrich von Bülow", 15, "", "", "", "", "Vigorous");
var prussianlate_sub4 = new Unit(148, "prussianlate", "subcommander", "Friedrich von Röder", 10, "", "", "", "", "Cavalry, Inspiring");
var prussianlate_guard = new Unit(149, "prussianlate", "infantry", "Guards, Elite Infantry", 18, 7, "", 2, "", "Skirmish, Steady, Shock");
var prussianlate_line = new Unit(150, "prussianlate", "infantry", "Line Regiment", 12, 6, "", 6, "", "Skirmish");
var prussianlate_reserve = new Unit(151, "prussianlate", "infantry", "Reserve Regiment", 10, 6, 2, "", "", "");
var prussianlate_landwehr = new Unit(152, "prussianlate", "infantry", "Landwehr", 6, 5, 2, "", "", "Conscript");
var prussianlate_guard_cav = new Unit(153, "prussianlate", "cavalry", "Guard Cavalry, Cuirassiers", 15, 7, "", 1, "", "Shock");
var prussianlate_light_cav = new Unit(154, "prussianlate", "cavalry", "Light Cavalry", 10, 6, "", 6, "", "");
var prussianlate_lw_cav = new Unit(155, "prussianlate", "cavalry", "Landwehr Cavalry", 6, 5, "", 6, "", "Impetuous");
var prussianlate_foot_art = new Unit(156, "prussianlate", "artillery", "Foot Artillery", 6, "", "", 4, "5-4-4-3-2-2", "");
var prussianlate_horse_art = new Unit(157, "prussianlate", "artillery", "Horse Artillery", 9, "", "", 3, "5-4-4-3-2-2", "Mobile");
var prussianlate_hvy_art = new Unit(158, "prussianlate", "artillery", "Heavy Artillery", 9, "", "", 3, "5-4-4-3-2-2", "Heavy ART");
var prussianlate_ally_inf = new Unit(159, "prussianlate", "allies", "Russian Infantry", 11, 6, "", 6, "", "Steady");
var prussianlate_ally_cavalry = new Unit(160, "prussianlate", "allies", "Russian Light Cavalry", 10, 6, "", 4, "", "");
var prussianlate_cossacks = new Unit(161, "prussianlate", "allies", "Cossacks", 4, 4, "", 2, "", "");

var russian_com1 = new Unit(162, "russian", "commander", "Kutusov", 10, "", "", "", "", "Legend, Immobile");
var russian_sub1 = new Unit(163, "russian", "subcommander", "Mikhail Miloradovich", 15, "", "", "", "", "Cavalry, Vigorous");
var russian_sub2 = new Unit(164, "russian", "subcommander", "Nikolai Rayevski", 5, "", "", "", "", "Steadfast");
var russian_sub3 = new Unit(165, "russian", "subcommander", "Pyotr Bagration", 10, "", "", "", "", "Inspiring");
var russian_sub4 = new Unit(166, "russian", "subcommander", "M. Barclay de Tolly", 15, "", "", "", "", "Vigorous");
var russian_sub5 = new Unit(167, "russian", "subcommander", "Alexander Kutaisov", 5, "", "", "", "", "Artillery");
var russian_sub6 = new Unit(168, "russian", "subcommander", "Dmitri Neverovski", 10, "", "", "", "", "Hero");
var russian_guards= new Unit(169, "russian", "infantry", "Guards, Grenadiers", 16, 7, "", 4, "", "Steady, Shock");
var russian_infantry = new Unit(170, "russian", "infantry", "Infantry", 11, 6, 4, "", "", "Steady");
var russian_militia = new Unit(171, "russian", "infantry", "Militia", 6, 5, "", 4, "", "Conscript");
var russian_cuirassiers = new Unit(172, "russian", "cavalry", "Guard Cavalry, Cuirassiers", 15, 7, "", 4, "", "Shock");
var russian_other_cavalry = new Unit(173, "russian", "cavalry", "Other Cavalry", 10, 6, "", 6, "", "");
var russian_cossacks = new Unit(174, "russian", "cavalry", "Cossacks", 4, 4, "", 4, "", "");
var russian_foot_artillery = new Unit(175, "russian", "artillery", "Foot Artillery", 6, "", "", 6, "6-5-5-4-3-3", "");
var russian_horse_artillery = new Unit(176, "russian", "artillery", "Horse Artillery", 9, "", "", 2, "6-5-5-4-3-3", "Mobile");
var russian_heavy_artillery = new Unit(177, "russian", "artillery", "Heavy Artillery", 9, "", "", 4, "6-5-5-4-3-3", "Heavy ART");

var spanish_sub1 = new Unit(178, "spanish", "subcommander", "Francisco Ballesteros", 5, "", "", "", "", "Steadfast");
var spanish_sub2 = new Unit(179, "spanish", "subcommander", "Pedro Giron", 10, "", "", "", "", "Inspiring");
var spanish_sub3 = new Unit(180, "spanish", "subcommander", "Jose Zayas", 5, "", "", "", "", "Steadfast");
var spanish_sub4 = new Unit(181, "spanish", "subcommander", "Vicente Canas", 10, "", "", "", "", "Hero");
var spanish_guard = new Unit(182, "spanish", "infantry", "Guards, Grenadiers, Foreign", 12, 6, "", 4, "", "Steady");
var spanish_reg = new Unit(183, "spanish", "infantry", "Regular Infantry", 8, 5, "", 10, "", "");
var spanish_prov = new Unit(184, "spanish", "infantry", "Provincial Infantry", 7, 5, 6, "", "", "Conscript");
var spanish_militia = new Unit(185, "spanish", "infantry", "Militia", 3, 4, "", 6, "", "Conscript, Impetuous");
var spanish_hvy_cav = new Unit(186, "spanish", "cavalry", "Heavy Cavalry", 9, 6, "", 4, "", "Impetuous");
var spanish_lt_cav = new Unit(187, "spanish", "cavalry", "Light Cavalry", 6, 5, "", 3, "", "Impetuous");
var spanish_irr_cav = new Unit(188, "spanish", "cavalry", "Irregular Cavalry", 4, 4, "", 2, "", "");
var spanish_foot_artillery = new Unit(189, "spanish", "artillery", "Foot Artillery", 6, "", "", 2, "4-4-3-3-2-2", "");
var spanish_horse_artillery = new Unit(190, "spanish", "artillery", "Horse Artillery", 9, "", "", 1, "4-4-3-3-2-2", "");
var spanish_hvy_artillery = new Unit(191, "spanish", "artillery", "Heavy Artillery", 9, "", "", 1, "4-4-3-3-2-2", "");

var attached_art = new Unit(192, "all", "artillery", "Attached Artillery", 2, "", "", "", "", "");
var entrenchments = new Unit(193, "all", "special", "Entrenchments", 1, "", "", 10, "", "");
var terrain_one = new Unit(194, "terrain", "special", "1 Additional Terrain Choice", 5, "", "", "1", "", "");
var terrain_two = new Unit(195, "terrain", "special", "2 Additional Terrain Choices", 15, "", "", "1", "", "");
var terrain_three = new Unit(196, "terrain", "special", "3 Additional Terrain Choices", 30, "", "", "1", "", "");
var shock_landwehr = new Unit(198, "prussianlate", "special", "Landwehr Shock Trait", 1, "", "", 0, "", "add Shock to a landwehr unit");
var mixed_brigade = new Unit(197, "prussianlate", "special", "Mixed Brigade Trait", 2, "", "", 0, "", "add Mixed Brigade to any infantry unit");
var delay  = new Unit(199, "all", "special", "Delay", 5, "", "", "", "", "Delay battle 6 turns");
var information = new Unit(200, "all", "special", "Information", 15, "", "", "", "", "Reveal one enemy column");
var prisoners = new Unit(201, "all", "special", "No Prisoners", 10, "", "", "", "", "Change retired enemy unit to broken");
var counter  = new Unit(202, "all", "special", "Counterstroke", 10, "", "", "", "", "Add 1 campaign VP");
var ambush = new Unit(203, "all", "special", "Ambush", 5, "", "", 5, "", "Cause d6 fatigue on enemy column per die");


var austrian_troops = [austrian_com1, austrian_sub1, austrian_sub2, austrian_sub3, austrian_grenadiers, austrian_veteran_grenz, austrian_avant_garde, austrian_veteran_infantry, austrian_conscripts,
austrian_landwehr, austrian_cuirassiers, austrian_hussars, austrian_other_cavalry, austrian_insurrection,
austrian_foot_artillery, austrian_horse_artillery, austrian_heavy_artillery, attached_art];

var british_hd_troops = [british_hd_com1, british_hd_sub1, british_hd_sub2, british_hd_sub3, british_hd_sub4, british_hd_foot_guards, british_hd_light_infantry,
british_hd_elite_infantry, british_hd_foot_regiments, british_hd_guard_horse, british_hd_light_cavalry, british_hd_foot_artillery, british_hd_horse_artillery,
british_hd_heavy_artillery, british_hd_brunswickers, british_hd_dutch_belgian, british_hd_dutch_militia, british_hd_nassauers, british_hd_brunswick_cavalry,
british_hd_dutch_cavalry, attached_art];

var british_p_troops = [british_com1, british_sub1, british_sub2, british_sub3, british_sub4, british_foot_guards, british_light_infantry, british_elite_infantry,
british_foot_regiments, british_guard_horse, british_light_cavalry, british_foot_artillery, british_horse_artillery, british_heavy_artillery, british_brunswickers,
british_veteran_portuguese, british_portuguese, british_spanish_infantry, british_spanish_provincal, british_brunswick_cavalry, british_portuguese_cavalry,
british_spanish_light_cavalry, british_spanish_irregular_cavalry, attached_art];

var frenchearly_troops = [frenchearly_com1, frenchearly_sub1, frenchearly_sub2, frenchearly_sub3, frenchearly_sub4, frenchearly_sub5, frenchearly_sub6,
frenchearly_sub7, frenchearly_sub8, frenchearly_old_guard, frenchearly_guard_infantry, frenchearly_elite_infantry, frenchearly_line_infantry,
frenchearly_guard_cavalry, frenchearly_cuirassiers, frenchearly_dragoons, frenchearly_light_cavalry, frenchearly_foot_artillery,
frenchearly_horse_artillery, frenchearly_heavy_artillery, guardearly_foot_artillery, guardearly_horse_artillery,
guardearly_heavy_artillery, frenchearly_allied_elite, frenchearly_polish_infantry, frenchearly_french_model, frenchearly_other_infantry,
frenchearly_conscripts, frenchearly_elite_cavalry, frenchearly_polish_cavalry, frenchearly_allied__cavalry, frenchearly_poor_cavalry, attached_art];

var frenchlate_troops = [frenchlate_com1, frenchlate_sub1, frenchlate_sub2, frenchlate_sub3, frenchlate_sub4, frenchlate_sub5, frenchlate_sub6,
frenchlate_old_guard, frenchlate_guard_infantry, frenchlate_veteran_infantry, frenchlate_conscripts, frenchlate_guard_cavalry,
frenchlate_heavy_cavalry, frenchlate_light_cavalry, frenchlate_foot_artillery, frenchlate_horse_artillery, frenchlate_heavy_artillery,
guardlate_foot_artillery, guardlate_horse_artillery, guardlate_heavy_artillery, frenchlate_allied_veteran, frenchlate_allied_conscript,
frenchlate_allied_cav, attached_art];

var ottoman_troops = [ottoman_com1, ottoman_com2, ottoman_sub1, ottoman_sub2, ottoman_sub3, ottoman_elite_jan, ottoman_vet_jan, ottoman_con_jan,
ottoman_prov_inf, ottoman_nizam, ottoman_reg_cav, ottoman_irr_cav, ottoman_irr_cav_norecon, ottoman_foot_artillery, ottoman_heavy_artillery, attached_art,
entrenchments, terrain_one, terrain_two, terrain_three];

var prussianearly_troops = [prussianearly_sub1, prussianearly_sub2, prussianearly_sub3, prussianearly_guards, prussianearly_avant, prussianearly_inf,
prussianearly_hvy_cav, prussianearly_light_cav, prussianearly_foot_art, prussianearly_horse_art, prussianearly_hvy_art, prussianearly_ally_guard,
prussianearly_ally_inf, prussianearly_ally_cav, attached_art];

var prussianlate_troops = [prussianlate_com1, prussianlate_sub1, prussianlate_sub2, prussianlate_sub3, prussianlate_sub4, prussianlate_guard,
prussianlate_line, prussianlate_reserve, prussianlate_landwehr, prussianlate_guard_cav, prussianlate_light_cav, prussianlate_lw_cav, prussianlate_foot_art,
prussianlate_horse_art, prussianlate_hvy_art, prussianlate_ally_inf, prussianlate_ally_cavalry, prussianlate_cossacks, attached_art, mixed_brigade,
shock_landwehr];

var russian_troops = [russian_com1, russian_sub1, russian_sub2, russian_sub3, russian_sub4, russian_sub5, russian_sub6, russian_guards, russian_infantry,
russian_militia, russian_cuirassiers, russian_other_cavalry, russian_cossacks, russian_foot_artillery, russian_horse_artillery, russian_heavy_artillery,
attached_art];

var spanish_troops = [spanish_sub1, spanish_sub2, spanish_sub3, spanish_sub4, spanish_guard, spanish_reg, spanish_prov, spanish_militia, spanish_hvy_cav,
spanish_lt_cav, spanish_irr_cav, spanish_foot_artillery, spanish_horse_artillery, spanish_hvy_artillery, attached_art, entrenchments, terrain_one, terrain_two,
terrain_three, delay, information, prisoners, counter, ambush];


let austrian = new Army (0, "austrian", "Austrian Army List", austrian_troops, 1);
let british_hd = new Army (1, "british_hd","British Army List: Hundred Days", british_hd_troops, 3);
let british_p = new Army (2, "british_p", "British Army List: Peninsular", british_p_troops, 3);
let frenchearly = new Army (3, "frenchearly", "French Army List: Early War (1805-12)", frenchearly_troops, 3);
let frenchlate = new Army (4, "frenchlate", "French Army List: Late War (1813-14)", frenchlate_troops, 2);
let ottoman = new Army (5, "ottoman", "Ottoman Army List", ottoman_troops, 1);
let prussianearly = new Army (6, "prussianearly", "Prussian Army List: Early War (1806-07)", prussianearly_troops, 2);
let prussianlate = new Army (7, "prussianlate", "Prussian Army List: Late War (1813-15)", prussianlate_troops, 3);
let russian = new Army(8, "russian", "Russian Army List", russian_troops, 2);
let spanish = new Army(9, "spanish", "Spanish Army List", spanish_troops, 2);

var factions = [austrian, british_hd, british_p, frenchearly, frenchlate, ottoman, prussianearly, prussianlate, russian, spanish];
