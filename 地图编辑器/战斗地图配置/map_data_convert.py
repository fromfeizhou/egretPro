#coding=utf-8


import os
import os.path
import json
with open('F:\\战斗地图配置\\json\\map_battle_1.json','r') as load_f:
	load_dict = json.load(load_f)
	# print(load_dict)
# print("ssssssssssssss")
# print(load_dict)

file = open ( 'HelloWorld.txt','w') 
# #写入白鹭皮肤
# file.write ( "<?xml version=\"1.0\" encoding=\"utf-8\"?>"+"\n")   # 开头
# file.write ( "<e:Skin class=\""+"HelloWorld"+"\" width=\""+str(psd.header.width)+ "\" height=\""+str(psd.header.width)+ "\" xmlns:e=\"http://ns.egret.com/eui\">\n") 

# file.close()

MAX_HEIGHT = 84
MAX_WIDTH = 40
for p in load_dict["layers"]:
	if p["name"] == "Terrain":
		map_data = p["data"]

# print map_data

can_not_walk = ""
wall_can_attack = ""
attack_park = ""
general_pos = ""
for index in range(len(map_data)):
	o_y = index // MAX_WIDTH
	o_x = index % MAX_WIDTH
	x = MAX_HEIGHT - 1 - o_y;
	y = MAX_WIDTH - 1 - o_x;
	# print "x = %d  , y = %d " %(x,y)

	if map_data[index] == 1:
		#不可行走点
		if can_not_walk != "":
			can_not_walk += ","
		can_not_walk += str(x)
		can_not_walk += "_"
		can_not_walk += str(y)

	if map_data[index] == 2:
		#城墙
		if wall_can_attack != "":
			wall_can_attack += ","
		wall_can_attack += str(x)
		wall_can_attack += "_"
		wall_can_attack += str(y)

	if map_data[index] == 3:
		#箭塔
		if attack_park != "":
			attack_park += ","
		attack_park += str(x)
		attack_park += "_"
		attack_park += str(y)
	if map_data[index] == 4:
		#武将位置
		if general_pos != "":
			general_pos += ","
		general_pos += str(x)
		general_pos += "_"
		general_pos += str(y)

# print can_not_walk

file.write ("can_not_walk" + "\n")
file.write (can_not_walk + "\n")
file.write ("wall_can_attack" + "\n")
file.write (wall_can_attack + "\n")
file.write ("attack_park" + "\n")
file.write (attack_park + "\n")
file.write ("general_pos" + "\n")
file.write (general_pos + "\n")
file.close()
