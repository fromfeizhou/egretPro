#coding=utf-8
import os
import time

def readSVNLog():
	#svn 路径
	rootDir = os.getcwd()  ## svn路径
	#时间
	date = time.strftime("%Y-%m-%d", time.localtime()) 

	# command  = ('svn log -r {%s}:HEAD %s') % ('2019-11-29',rootDir)
	command  = ('svn log -r {%s}:HEAD %s') % (date,rootDir)
	rootLogList = os.popen(command)

	res = rootLogList.read()
	rootLogList.close()
	result = []
	for line in res.splitlines():
		if line is None or (len(line) < 1):
			continue
		if '--------' in line:
			continue
		if line.count("|") >= 3:
			tmpList = line.split("|")
			message = tmpList[1]
		else:
			message = ('%s\t%s') % (line , message)
			if message not in result:
				result.append(message)
				print(message)

def main():
	print('18更新：')
	readSVNLog()

if __name__ == '__main__':
	main()
	os.system('pause')
