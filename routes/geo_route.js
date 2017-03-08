// Route Algo code
// find the shortest path between
// a given source cell to a destination cell.

// These arrays are used to get row and column
// numbers of 4 neighbours of a given cell
var rowNum = [-1, 0, 0, 1];
var colNum = [0, -1, 1, 0];
var diagonalRowNum =[-1,1,1,-1];
var diagonalColNum=[-1,-1,1,1];
var source= {};
var dest={};
var path=[];//contain the route cordinates
var diagonalPath=[];
var INT_MAX=-1;
var lowVal=0;
var ROW =lowVal;
var COL =lowVal;
var blackwhite=1;



var pathLine  = {
					        "type": "Feature",
					        "geometry": {
					                "type": "LineString",
					                "coordinates": []
					        },
					        "properties": {
					                "routeFlag": 2,
					                "result" : false
					        }
                }
// check whether given cell (row, col) is a valid
// cell or not.
isValid = function(row,col) {
			 // return true if row number and column number
			 // is in range
			 return ((row >= lowVal) && (row < ROW) && (col >= lowVal) && (col < COL));
};


buildMatrix = function (squareGrid, srcIndex, dstIndex, srcPoint, destPoint,prow,pcol) {

					ROW=prow;
					COL=pcol;
					var matrix = new Array(ROW);
					var visited = new Array(ROW);

					for (var i =0;i<ROW;i++) {
					       matrix[i] = new Array(COL);
								 visited[i] = new Array(COL);
					}

          console.log("No of ROW & COL are:::"+ROW+"   "+COL);

          var features =squareGrid.features;
					var ri=ROW-1,ci=lowVal;
					features.forEach(function (item,index){
								if (ri < lowVal){
										ri = ROW-1;
										ci++;
								}
								if(index == srcIndex)
								source = {"x":ri,"y":ci};
								if(index == dstIndex)
								dest = {"x":ri,"y":ci};
  							matrix[ri][ci]=item.properties.routeFlag;
	      				ri--;
					});

	     //  printMatrix(matrix,blackwhite);
				 //created the Visted matrix
				 for(var i =0;i<ROW;i++)
				 {
				 				for (var j=0;j<COL;j++)
				 								visited[i][j] = {"visit":false,"dist":0};
				 }

				 calculateBFS(features,matrix,visited,source,dest,srcPoint, destPoint);
}


//n
calculateBFS = function(features,matrix,visited,source,dest,srcPoint, destPoint){
				// console.log("Source cordinates::"+JSON.stringify(source));
	       //console.log("Destination cordinates::"+JSON.stringify(dest));
	       var dist = BFS(matrix,source,dest,visited);

	       if (dist != INT_MAX) {
	               console.log("Shortest Path is "+ dist);
								// console.log("path-->"+JSON.stringify(path));

								findDiagonalPath();


	               pathLine.geometry.coordinates= [];
	               pathLine.geometry.coordinates = pathLine.geometry.coordinates.concat([srcPoint.geometry.coordinates]);
	               diagonalPath.forEach(function(item,index){
                       // find the dignal path

											// console.log(item[lowVal]*COL+item[1]);
                       var xrow = (ROW-1)-item[0];
                       var xcol =item[1];
                       var index =item[0]*COL+item[1];
                       var xindex=xrow+COL*xcol;
                       pathLine.geometry.coordinates = pathLine.geometry.coordinates.concat([features[xindex].properties.center]);

                  });
	               pathLine.properties.result = true;
	               pathLine.geometry.coordinates = pathLine.geometry.coordinates.concat([destPoint.geometry.coordinates]);
	       }
	       else
	       {
	               console.log("Shortest Path doesn't exist");
	               path=[];
				   diagonalPath=[];
	               pathLine.geometry.coordinates= [];
	               pathLine.properties.result == false;
	               pathLine.properties.info = "No path exists between Origin and Destination";
	       }


}

// function to find the shortest path between
// a given source cell to a destination cell.
BFS = function(mat,src,dest,visited) {
			// check source and destination cell
			// of the matrix have value 1
			if (!mat[src.x][src.y] || !mat[dest.x][dest.y])
     			return INT_MAX;

			// Mark the source cell as visited
			visited[src.x][src.y].visit = true;
			visited[src.x][src.y].dist = 0;

			// Create a queue for BFS
			var q=[];

			// distance of source cell is 0
			var s ={src,"dist":0};
			q.push(s); // Enqueue source cell

			// Do a BFS starting from source cell
			while (q.length> lowVal)
			{
					var curr = q.shift();//get the first element from q
					var pt = curr.src;

					// If we have reached the destination cell,
					// we are done
					if (pt.x == dest.x && pt.y == dest.y)
					{
								/*
								console.log("---------------------");
								console.log("PrintMat:: The VISITED matrix ");
								printMat(visited,1);
								console.log("---------------------");
								*/
								// console.log("PrintMat:: The DISTANCE matrix ");
								//  printMat(visited,2);

								//    console.log("PrintMat:: The path cordinates matrix ");
								buildCoordi(visited,curr.dist,src,dest);
   							return curr.dist;
					 }

						// check & enqueue its adjacent cells
						for (var i = 0; i < 4; i++)
						{
									var row = pt.x + rowNum[i];
									var col = pt.y + colNum[i];

									// if adjacent cell is valid, has path and
									// not visited yet, enqueue it.
									if (isValid(row, col) && mat[row][col]&& !visited[row][col].visit )
									{
											// mark cell as visited and enqueue it
											visited[row][col].visit = true;
											visited[row][col].dist = curr.dist + 1;
											var  adjcell ={src :{"x":row,"y":col},"dist":curr.dist + 1};
											// console.log("path is "+ JSON.stringify(adjcell));
											q.push(adjcell);
									}
						}
	      }

		//return -1 if destination cannot be reached
		return INT_MAX;
}

//function to find the diagonal path
findDiagonalPath = function (){
	//var mpath = JSON.parse(path	);
	diagonalPath=[];
	var isDiagonalFound = false;
	diagonalPath.push([path[0][0],path[0][1]]);

   for(var i =0;i<path.length;i++)
	 {
		 for (var c = 0; c < 4; c++)
		 {
			     //console.log( "" );
					 var drow = Number(path[i][0]) + diagonalRowNum[c];
					 var dcol = Number(path[i][1]) + diagonalColNum[c];
					 if(isValid(drow, dcol) && (i+2<path.length)){
					      if (path[i+2][0] == drow && path[i+2][1] == dcol ){
									  diagonalPath.push([path[i+2][0],path[i+2][1]]);
										isDiagonalFound = true;
		                 //console.log("we can skip"+path[i+1]);
											i++;
											 break;
					   }
				}
	   }
		 if(!isDiagonalFound)
		 {
			 diagonalPath.push([path[i][lowVal],path[i][1]]);
		 }
  }
	//console.log("Final path-->"+diagonalPath);

}

          //print the matrix
printMatrix = function(mat,type) {

                   for (var i=0;i<ROW;i++)
                   {
                           for (var j=0;j<COL;j++)
                           {
                                   if (type == blackwhite)
                                   {

                                           if (mat[i][j] == "1"){
                                                   process.stdout.write("1 ");
                                           } else {
                                                   process.stdout.write("0 ");
                                           }

                                   } else if (type == visit) {

                                           if (mat[i][j].visit) {
                                                   process.stdout.write("1 ");
                                           }
                                           else {
                                                   process.stdout.write("0 ");
                                           }
                                   } else {
                                           process.stdout.write(JSON.stringify(mat[i][j].dist)+" ");
                                   }
                           }
                           console.log("");
                   }
};

buildCoordi = function(mat,dist,src,dest){
                   path=[];
                   path.push([dest.x,dest.y]);

                   var pt = dest;
                   dist = dist-1;
                   while(dist >lowVal)
                   {
                           for (var i = 0; i < 4; i++)
                           {
                                   var row = pt.x + rowNum[i];
                                   var col = pt.y + colNum[i];
                                   if (isValid(row, col) && mat[row][col] && mat[row][col].visit )
                                   {
                                           if(mat[row][col].dist == dist)
                                           {
                                                   path.push([row,col]);
                                                   //console.log("in dist"+dist+"::"+row,col);
                                                   dist = dist-1;
                                                   pt.x=row;
                                                   pt.y=col;
                                                   //continue;
                                           }
                                   }
                           }
                   }
                   //path.push([src.x,src.y])
                   //console.log(JSON.stringify(path));
                   path.reverse();

}


module.exports.pathLine = pathLine;
module.exports.isValid =isValid;
module.exports.buildMatrix =buildMatrix;
module.exports.printMatrix = printMatrix;
module.exports.buildCoordi =buildCoordi;
module.exports.BFS =BFS;
