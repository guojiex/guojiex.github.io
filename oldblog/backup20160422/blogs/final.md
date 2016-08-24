#openmp(2.1)
***
###Different level of Parallelism
####SIMD
Exploited using vectorizing compiler and hand-code intrinsics
####SMT
OS abstract it to core-level parallelism
####Core-level
Using threads to describe work done on different cores
***
###Thread overhead
Compute each step as a separate thread involves significant thread management overhead (hundreds of cycles)
### what is parallelizable
Computation of each step is independent
***
###False sharing
Two threads are writing to the same cache-line but different word inside
####Solution to false sharing
1. Be aware of the cache line sizes for a platform.
2. Avoid accessing the same cache line from different threads
***
###Reduction 聚合
在每一个线程中都会有一个私有的聚合变量，在退出并行区以后，把所有的这些私有变量（以及这个聚合变量在并行区之前的初始值）聚合成一个值

1. A local copy of each list variable is made and initialized depending on the “op” (e.g. 0 for “+”)
2. Updates occur on the local copy 
3. Local copies are reduced into a single value and combined with the original global value

###Sharing

Global variables are SHARED among threads

1.	File scope variables, staHc
2.	Dynamically allocated memory (ALLOCATE, malloc, new)
Not all are shared
1.	Functions called from parallel regions are PRIVATE
2.	Automatic variables within a statement block are PRIVATE

###Private
lastprivate:
	The value inside the loop can be transmitted to the shared variable outside.

###Schedule
The schedule clause affects how loop iteraHons are mapped onto threads:

1.	**static**:Deal-out blocks of iterations of size “chunk” to each thread.
2.	**dynamic**:Each thread grabs “chunk” iterations off a queue until all iterations have been handled
3.	**guided**:Threads dynamically grab blocks of iterations. The size of the block starts large and shrinks down to size “chunk” as the calculation proceeds.
4.	**runtime**:Schedule and chunk size taken from the OMP_SCHEDULE environmentvariable.

###Synchronization
####order
The ordered region executes in the sequential order
Order of reduction may cause rounding differences
####barrier
Each thread waits until all threads arrive
####Single
Only one thread will execute the region of code.

####NO WAIT / nowait
If specified, then threads do not synchronize at the end of the parallel loop.
####ORDERED
Specifies that the iterations of the loop must be executed as they would be in a serial program.
####COLLAPSE
Specifies how many loops in a nested loop should be collapsed into one large iteration space and divided according to the schedule clause. The sequential execution of the iterations in all associated loops determines the order of the iterations in the collapsed iteration space.

__fused-multiply-add__
***
#hadoop
####Why safe
1.	fail-safe storage:By default save 3 copies for each block
2.	fail-safe task management:Failed tasks re-scheduled up to 4 times

A distributed “group by” operation is implicitly performed between the map and reduce phasesIntermediate data arrives at each reducer in order,sorted by the key No ordering is guaranteed across reducers
###Master-slave structure
1. **JobTrackerNode**:Creating object for the job, determines number of mappers/ reduces, schedules jobs, bookkeeping tasks’ status and progress
2. **TaskTrackerNode**:slaves manage individual tasks

###HDFS I/O
A typical read from a client involves:
1.  Contact the NameNode to determine where the actual data is stored2.  NameNode replies with block idenIfiers and locaIons (which DataNode)3.  Contact the DataNode to fetch data
A typical write from a client involves:
1.	Contact the NameNode to update the namespace and verify permissions
2.	NameNode allocates a new block on a suitable DataNode
3.	The client directly streams to the selected DataNode4.	HDFS files are immutable
####advantage
Block replicaIon benefits MapReduce
1.	Scheduling decisions can take replicas into account
2.	Exploit better data locality

HDFS checksum all data during I/O

__Small number of large files preferred over a large number of small files__
###HDFS
namenode(master)->管理文件系统，持有文件系统树,和树中所有文件和目录的元数据（meta data）。同时namenode知道用户需要文件的各个文件块分别位于哪些datanode

datanode->存储以及取回文件块.定时（隔一段时间）向namenode汇报自己保存着谁的文件块
***
#cuda
####SIMT: Single Instruction Multiple Threads1.	A single instruction controls multiple processing element2.	Different from SIMD – SIMD exposes the SIMD width to the programmer3.	SIMT abstract the #threads in a thread block as a user-specified parameter
####Why not just use one thread block?
If you only use one core of a manycore hardware, it can not fully utilized the resources.

####<<<>>>
<<<numberOfBlocks,numberOfThreadsPerBlock>>>
####__syncthreads()
1.	waits until all threads in the thread block have reached this point and all global and shared memory accesses made by these threads prior to __syncthreads() are visible to all threads in the block2.	used to coordinate communication between the threads of the same block
####atomics
An atomic funcIon performs a read-modify-write atomic operation a word 
32-bit or 64-bit wordResiding in global or shared memory	
#additional(2.2)
1.	￼Expensive operations: /, %, sin, cos, log.  Use other cheap operations to replace them
2.	Function Inlining:

		double f(a){return a/c}
		for i=1 to n
			sum+=f(a[i])
		***->
		for i=1 to n
			sum+=a/c
3.	loop unrolling
4.	Common Sub-expression EliminaLon

		for j = 1..m        	for i = 1..n            	sum = sum + cos(j*PI/180)*a[i];
        ->
		for j=1 to m 
			double c=cos(j*PI/180)
			for i= 1 to n
				sum=sum+c*a[i]
5.	table lookup
6.	Load/Store Elimination:
	Loop Merging
	Branch Elimination
	
		
