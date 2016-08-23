/*!
 * guo.d3.js - v1.1 (2013-11-19 18:07:14)
 * Copyright 2013
 * author:Jiexin Guo,郭捷昕
 * e-mail:guojiexinsysu@gmail.com or 1036479561@qq.com
 * 本文件是index.html网页的逻辑控制部分，使用了d3.js的开源库，以及jquery-1.8.0库辅助
 */

/**
 * [定义不同节点状态的颜色]
 * @type {Object}
 */
var colorList = {
  '线损异常': 'red',
  'childLineLossAlert': 'yellow'
};

/**
 * [CONST_LINELOSSRATE_ALERT 设定当线损超过这个阀值就报警]
 * @type {Number}
 */
var CONST_LINELOSSRATE_ALERT = 1;

console.log("线损状态阀值：" + CONST_LINELOSSRATE_ALERT + "%");
/**
 * [初始化d3库的各种配置]
 */
function initD3() {
  var m = [20, 120, 20, 120],
    w = 1280 - m[1] - m[3],
    h = 800 - m[0] - m[2],
    i = 0,
    root;
  /**
   * [可视化的树变量]
   * @type {[d3.layout.tree]}
   */
  var tree = d3.layout.tree()
    .separation(function(a, b) {
      return (a.parent == b.parent ? 1 : 2) * a.depth;
    }).size([h, w]);

  var diagonal = d3.svg.diagonal()
    .projection(function(d) {
      return [d.y, d.x];
    });
  var lineLossRateJson = null;
  var vis = d3.select("#body").append("svg:svg")
    .attr("width", w + m[1] + m[3])
    .attr("height", h + m[0] + m[2])
    .append("svg:g")
    .attr("transform", "translate(" + m[3] + "," + m[0] + ")");
  d3.json("data3.json", function(json) {
    if (json !== null) {
      lineLossRateJson = json;
    }
  });
  d3.json("data.json",
    /**
     * [打开的json文件的处理函数]
     * @param  {[type]} json [description]
     */
    function(json) {
      /**
       * [根节点]
       * @type {[type]}
       */
      root = json;
      var actout = 0;

      function getTotalIn(nodeRoot) {
        var totalIn = 0;
        for (child in nodeRoot.children) {
          totalIn += parseFloat(nodeRoot.children[child]. in );
        }
        lineLossRateJson.rootIn = totalIn;
      }

      function getLeafout(node) {
        if (!node.children) {
          actout = actout + parseFloat(node.out);
        } else {
          for (child in node.children) {
            getLeafout(node.children[child]);
          }
        }
      }
      if (lineLossRateJson != null) {
        getTotalIn(root);
        getLeafout(root);
        lineLossRateJson.rootActConsume = actout;
      }      
      console.log("总节点数：" + json.totalnodelength);
      root.x0 = h / 2;
      root.y0 = 0;
      if (lineLossRateJson != null) {
        console.log("总供电量：" + lineLossRateJson.rootIn);
        console.log("总售电量：" + lineLossRateJson.rootActConsume);
        root.ComprehensiveLineLossRate = (lineLossRateJson.rootIn - lineLossRateJson.rootActConsume) / lineLossRateJson.rootIn * 100;
        console.log("综合线损率：" + root.ComprehensiveLineLossRate + "%");
      }

      function toggleAll(d) {
        if (d.children) {
          d.children.forEach(toggleAll);
          toggle(d);
        }
      }
      // Initialize the display to show a few nodes.
      root.children.forEach(toggleAll);
      $('#controlButton').click(function(e) {
        if (!$("#controlButton").hasClass("disabled")) {
          root.children.forEach(toggleAll);
          update(root);
          $('#controlButton').addClass("disabled");
        }
      });
      $('#toggleStatusButton').click(function(e) {
        toggleNodeHaveStatus(root);
        update(root);
      });
      // toggle(root.children[1]);
      update(root);
    });
  /**
   * 刷新整棵树
   * @param  {[type]} source [description]
   * @return {[type]}        [description]
   */
  function update(source) {
    var duration = d3.event && d3.event.altKey ? 5000 : 500;

    // Compute the new tree layout.
    var nodes = tree.nodes(root).reverse();

    // Normalize for fixed-depth.
    nodes.forEach(function(d) {
      d.y = d.depth * 180;
      if (lineLossRateJson)
        loadLineLoss(d);
    });

    function loadLineLoss(d) {
      if (lineLossRateJson != null && lineLossRateJson[d.name] != undefined) {
        d.lineLossRate = lineLossRateJson[d.name];
        if (parseFloat(d.lineLossRate) > CONST_LINELOSSRATE_ALERT) {
          d.status = '线损异常';
        } else {
          d.status = "正常";
        }
      }
      if (d.children)
        loadLineLoss(d.children);
      if (d._children)
        loadLineLoss(d._children);
    }
    // Update the nodes…
    var node = vis.selectAll("g.node")
      .data(nodes, function(d) {
        return d.id || (d.id = ++i);
      });

    // Enter any new nodes at the parent's previous position.
    var nodeEnter = node.enter().append("svg:g")
      .attr("class", "node")
      .attr("transform", function(d) {
        return "translate(" + source.y0 + "," + source.x0 + ")";
      })
      .on("click",
        function(d) { //这是展开节点的对应的click函数          
          toggle(d);
          update(d);
        });

    // 如果当前节点有子节点，那么他的颜色是"lightsteelblue"，如果不能展开（即没有子节点），那么就是白色
    nodeEnter.append("svg:circle")
      .attr("r", 1e-6)
      .style("fill", function(d) {
        if (d.status in colorList)
          return colorList[d.status];
        return d._children ? "lightsteelblue" : "#fff";
      }).attr('status', function(d) {
        if (d.status != undefined)
          return d.status;
      });
      // 以下是生成显示节点和节点文字的代码
    nodeEnter.append("svg:text")
      .attr("x", function(d) {
        return d.children || d._children ? -10 : 10;
      })
      .attr("dy", ".35em")
      .attr("text-anchor", function(d) {
        return d.children || d._children ? "end" : "start";
      })
      .text(function(d) {
        return d.title;
      })
      .style("fill-opacity", 1e-6);

    /**
     * [给节点增加说明文字]
     * @param  {[type]} d [节点输入]
     */
    nodeEnter.append("title").text(function(d) {
      var titlestring = d.title + " ";
      titlestring += d. in == 0 ? "" : "输入电量:" + d. in ;
      titlestring += " 输出电量:" + d.out;
      if (d.ComprehensiveLineLossRate !== undefined)
        titlestring += ' 综合线损率: ' + d.ComprehensiveLineLossRate + "% ";
      if (d.lineLossRate !== undefined)
        titlestring += ' 线损率: ' + d.lineLossRate + "% ";
      return d.status == undefined ? titlestring : titlestring + " 状态:" + d.status;
    });

    // Transition nodes to their new position.
    var nodeUpdate = node.transition()
      .duration(duration)
      .attr("transform", function(d) {
        return "translate(" + d.y + "," + d.x + ")";
      });

    // 如果当前节点有子节点，那么他的颜色是"lightsteelblue"，如果不能展开（即没有子节点），那么就是白色
    nodeUpdate.select("circle")
      .attr("r", 4.5)
      .style("fill", function(d) {
        // if (d.status in colorList)
        //   return colorList[d.status];
        // if (d.lineLossRate !== undefined && parseFloat(d.lineLossRate) > CONST_LINELOSSRATE_ALERT)
        //   return 'red';
        if (d.status in colorList)
          return colorList[d.status];
        return d._children ? "lightsteelblue" : "#fff";
      }).attr('status', function(d) {
        if (d.status != undefined)
          return d.status;
      });

    nodeUpdate.select("text")
      .style("fill-opacity", 1);

    // Transition exiting nodes to the parent's new position.
    var nodeExit = node.exit().transition()
      .duration(duration)
      .attr("transform", function(d) {
        return "translate(" + source.y + "," + source.x + ")";
      })
      .remove();

    nodeExit.select("circle")
      .attr("r", 1e-6);

    nodeExit.select("text")
      .style("fill-opacity", 1e-6);

    // Update the links…
    var link = vis.selectAll("path.link")
      .data(tree.links(nodes), function(d) {
        return d.target.id;
      });

    // Enter any new links at the parent's previous position.
    link.enter().insert("svg:path", "g")
      .attr("class", "link")
      .attr("d", function(d) {
        var o = {
          x: source.x0,
          y: source.y0
        };
        return diagonal({
          source: o,
          target: o
        });
      })
      .transition()
      .duration(duration)
      .attr("d", diagonal);

    // 把连接线展开到新的位置
    link.transition()
      .duration(duration)
      .attr("d", diagonal);

    // Transition exiting nodes to the parent's new position.
    link.exit().transition()
      .duration(duration)
      .attr("d", function(d) {
        var o = {
          x: source.x,
          y: source.y
        };
        return diagonal({
          source: o,
          target: o
        });
      })
      .remove();

    // Stash the old positions for transition.
    nodes.forEach(function(d) {
      d.x0 = d.x;
      d.y0 = d.y;
    });
  }

  function toggleNodeHaveStatus(d) {
    if (d.status !== undefined) {
      controlToggle(d);
      if (d.children)
        for (child in d.children) {
          toggleNodeHaveStatus(d.children[child]);
        }
    } else
      return;
  }
  /**
   * [强制展开所有包含异常状态的节点]
   * @param  {[type]} d [输入节点]
   */
  function controlToggle(d) {
    if (d.status in colorList) {
      if (!d.children) {
        d.children = d._children;
        d._children = null;
        $('#controlButton').removeClass("disabled");
      }
    }
  }
  /**
   * [展开或者折叠子节点]
   * @param  {[type]} d [要展开或者折叠的节点]
   */
  function toggle(d) {
    if (d.children) { //如果子节点已经展开，那么折叠
      d._children = d.children;
      d.children = null;
    } else { //如果子节点没有展开，那么展开      
      d.children = d._children;
      d._children = null;
      //展开以后才启用collapse all nodes 控制按钮
      $('#controlButton').removeClass("disabled");
    }
  }
};
