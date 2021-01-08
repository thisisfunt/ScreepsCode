const max_h = 2;
const max_u = 2;
const max_b = 1;

const u_data = [MOVE, CARRY, WORK];
const h_data = [MOVE, CARRY, WORK];
const b_data = [MOVE, CARRY, WORK];

module.exports.loop = function(){
    var count_h = 0;
    var count_u = 0;
    var count_b = 0;
    
    for(var name in Game.creeps){
        var creep = Game.creeps[name];
        var sources = creep.room.find(FIND_SOURCES);
        var s1 = Game.spawns.Spawn1;
        var controller = creep.room.controller;
        
        if(creep.memory.role == "h"){
            count_h++;
            if(creep.carry.energy == 0 || (creep.harvest(sources[1]) != ERR_NOT_IN_RANGE && creep.carry.energy < creep.carryCapacity)){
                console.log("Im take source");
                if(creep.harvest(sources[1]) == ERR_NOT_IN_RANGE){
                    creep.moveTo(sources[1]);
                }
            } else {
                if(s1.energy < s1.energyCapacity){
                    if(creep.transfer(s1, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                        creep.moveTo(s1);
                    }
                } else {
                    var res = creep.pos.findClosestByRange(FIND_MY_STRUCTURES,
                                                        {filter:
                                                            function(obj){
                                                                if(obj.structureType == STRUCTURE_EXTENSION){
                                                                    return obj.energy < obj.energyCapacity;
                                                                }
                                                                return false;
                                                            }});
                    if(res){
                        if(creep.transfer(res, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                            creep.moveTo(res);
                        }
                    } else{
                        if(creep.upgradeController(controller) == ERR_NOT_IN_RANGE){
                            creep.moveTo(controller);
                        }
                    }
                    
                }
                
                
            }
        } else if(creep.memory.role == "u"){
            count_u++;
            if(creep.carry.energy == 0 || (creep.harvest(sources[0]) != ERR_NOT_IN_RANGE && creep.carry.energy < creep.carryCapacity)){
                if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE){
                    creep.moveTo(sources[0]);
                }
            } else {
                if(creep.upgradeController(controller) == ERR_NOT_IN_RANGE){
                    creep.moveTo(controller);
                }
            }
        } else if(creep.memory.role == "b"){
            count_b++;
            if(creep.carry.energy == 0 || (creep.harvest(sources[1]) != ERR_NOT_IN_RANGE && creep.carry.energy < creep.carryCapacity)){
                if(creep.harvest(sources[1]) == ERR_NOT_IN_RANGE){
                    creep.moveTo(sources[1]);
                }
            } else {
                var res = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
                if(res){
                    var target = Game.getObjectById(res.id);
                    if(creep.build(target) == ERR_NOT_IN_RANGE){
                        creep.moveTo(target);
                    }
                } else {
                    if(creep.upgradeController(controller) == ERR_NOT_IN_RANGE){
                        creep.moveTo(controller);
                    }
                }
            }
        }
    }
    
    if(s1.canCreateCreep(h_data) == OK && count_h < max_h){
        name = s1.createCreep(h_data);
        Game.creeps[name].memory.role = "h";
    } else if(s1.canCreateCreep(u_data) == OK && count_u < max_u){
        name = s1.createCreep(u_data);
        Game.creeps[name].memory.role = "u";
    } else if(s1.canCreateCreep(b_data) == OK && count_b < max_b){
        var res = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
        if(res){
            name = s1.createCreep(b_data);
            Game.creeps[name].memory.role = "b";
        }
    }