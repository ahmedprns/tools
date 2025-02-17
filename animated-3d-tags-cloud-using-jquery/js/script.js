!function(){function t(t,e){function n(){A=document.createElementNS(E,"svg"),A.addEventListener("mousemove",v),t.appendChild(A),p.bgDraw&&(P=document.createElementNS(E,"rect"),P.setAttribute("x",0),P.setAttribute("y",0),P.setAttribute("fill",p.bgColor),A.appendChild(P)),a(),i(),d(),window.addEventListener("resize",y)}function i(){var e=window.innerWidth||document.documentElement.clientWidth||document.body.clientWidth,n=window.innerHeight||document.documentElement.clientHeight||document.body.clientHeight,i=e,r=n;p.width.toString().indexOf("%")>0||p.height.toString().indexOf("%")>0?(i=Math.round(t.offsetWidth/100*parseInt(p.width)),r=Math.round(i/100*parseInt(p.height))):(i=parseInt(p.width),r=parseInt(p.height)),i>=e&&(i=e),r>=n&&(r=n),b={x:i/2,y:r/2},O.x=p.speed/b.x,O.y=p.speed/b.y,w=i>=r?r/100*parseInt(p.radius):i/100*parseInt(p.radius),1>w&&(w=1),x=w/2,x<p.radiusMin&&(x=p.radiusMin,w=2*x),A.setAttribute("width",i),A.setAttribute("height",r),p.bgDraw&&(P.setAttribute("width",i),P.setAttribute("height",r)),o(x)}function o(t){for(var e=0,n=S.length;n>e;e++)r(S[e],t)}function r(t,e){var n=t.vectorPosition.x-C.x,i=t.vectorPosition.y-C.y,o=t.vectorPosition.z-C.z,r=Math.sqrt(n*n+i*i+o*o);t.vectorPosition.x/=r,t.vectorPosition.y/=r,t.vectorPosition.z/=r,t.vectorPosition.x*=e,t.vectorPosition.y*=e,t.vectorPosition.z*=e}function s(t,e,n,i,o){var r={};return r.element=document.createElementNS(E,"text"),r.element.setAttribute("x",0),r.element.setAttribute("y",0),r.element.setAttribute("fill",p.fontColor),r.element.setAttribute("font-family",p.fontFamily),r.element.setAttribute("font-size",p.fontSize),r.element.setAttribute("font-weight",p.fontWeight),r.element.setAttribute("font-style",p.fontStyle),r.element.setAttribute("font-stretch",p.fontStretch),r.element.setAttribute("text-anchor","middle"),r.element.textContent=p.fontToUpperCase?e.label.toUpperCase():e.label,r.link=document.createElementNS(E,"a"),r.link.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href",e.url),r.link.setAttribute("target",e.target),r.link.addEventListener("mouseover",f,!0),r.link.addEventListener("mouseout",h,!0),r.link.appendChild(r.element),r.index=t,r.mouseOver=!1,r.vectorPosition={x:n,y:i,z:o},r.vector2D={x:0,y:0},A.appendChild(r.link),r}function a(){for(var t=1,e=p.entries.length+1;e>t;t++){var n=Math.acos(-1+(2*t-1)/e),i=Math.sqrt(e*Math.PI)*n,o=Math.cos(i)*Math.sin(n),r=Math.sin(i)*Math.sin(n),a=Math.cos(n),u=s(t-1,p.entries[t-1],o,r,a);S.push(u)}}function u(t){for(var e=0,n=S.length;n>e;e++){var i=S[e];if(i.element.getAttribute("x")===t.getAttribute("x")&&i.element.getAttribute("y")===t.getAttribute("y"))return i}}function c(t){for(var e=u(t),n=0,i=S.length;i>n;n++){var o=S[n];o.index===e.index?o.mouseOver=!0:o.mouseOver=!1}}function l(){var t=O.x*z.x-p.speed,e=p.speed-O.y*z.y,n=t*k,i=e*k;D.sx=Math.sin(n),D.cx=Math.cos(n),D.sy=Math.sin(i),D.cy=Math.cos(i);for(var o=0,r=S.length;r>o;o++){var s=S[o];if(M){var a=s.vectorPosition.x,u=s.vectorPosition.y*D.sy+s.vectorPosition.z*D.cy;s.vectorPosition.x=a*D.cx+u*D.sx,s.vectorPosition.y=s.vectorPosition.y*D.cy+s.vectorPosition.z*-D.sy,s.vectorPosition.z=a*-D.sx+u*D.cx}var c=p.fov/(p.fov+s.vectorPosition.z);s.vector2D.x=s.vectorPosition.x*c+b.x,s.vector2D.y=s.vectorPosition.y*c+b.y,s.element.setAttribute("x",s.vector2D.x),s.element.setAttribute("y",s.vector2D.y);var l;M?(l=(x-s.vectorPosition.z)/w,l<p.opacityOut&&(l=p.opacityOut)):(l=parseFloat(s.element.getAttribute("opacity")),l+=s.mouseOver?(p.opacityOver-l)/p.opacitySpeed:(p.opacityOut-l)/p.opacitySpeed),s.element.setAttribute("opacity",l)}S=S.sort(function(t,e){return e.vectorPosition.z-t.vectorPosition.z})}function d(){requestAnimFrame(d),l()}function f(t){M=!1,c(t.target)}function h(t){M=!0}function v(t){z=m(A,t)}function m(t,e){var n=t.getBoundingClientRect();return{x:e.clientX-n.left,y:e.clientY-n.top}}function y(t){i()}var p={entries:[],width:480,height:480,radius:"70%",radiusMin:75,bgDraw:!0,bgColor:"#000",opacityOver:1,opacityOut:.05,opacitySpeed:6,fov:800,speed:2,fontFamily:"Arial, sans-serif",fontSize:"15",fontColor:"#fff",fontWeight:"normal",fontStyle:"normal",fontStretch:"normal",fontToUpperCase:!1};if(void 0!==e)for(var g in e)e.hasOwnProperty(g)&&p.hasOwnProperty(g)&&(p[g]=e[g]);if(!p.entries.length)return!1;var x,w,b,A,P,S=[],M=!0,z={x:0,y:0},C={x:0,y:0,z:0},O={x:0,y:0},D={sx:0,cx:0,sy:0,cy:0},k=Math.PI/180,E="http://www.w3.org/2000/svg";window.requestAnimFrame=function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||function(t){window.setTimeout(t,1e3/60)}}(),n()}window.SVG3DTagCloud=t}(),"undefined"!=typeof jQuery&&!function(t){t.fn.svg3DTagCloud=function(e){return this.each(function(){t.data(this,"plugin_SVG3DTagCloud")||t.data(this,"plugin_SVG3DTagCloud",new SVG3DTagCloud(this,e))})}}(jQuery);	

$( document ).ready( function() {

            var entries = [ 

                { label: 'svg dual icons', url: 'https://codepen.io/uiswarup/pen/JjVPBem', target: '_blank' },
                { label: 'pop up menu', url: 'https://codepen.io/uiswarup/pen/yLwmmdr', target: '_blank' },
                { label: 'Menu Design', url: 'https://codepen.io/uiswarup/pen/JjzgQVz', target: '_blank' },
                { label: 'bubbles animation', url: 'https://codepen.io/uiswarup/pen/XWGGyWQ', target: '_blank' },
                { label: 'Dropdown Menu', url: 'https://codepen.io/uiswarup/pen/yLwmmdr', target: '_blank' },
                { label: '3D', url: 'https://codepen.io/uiswarup/pen/rNRjRZN', target: '_blank' },
                { label: 'happy birthday', url: 'https://codepen.io/uiswarup/pen/MWxadGe', target: '_blank' },
                { label: 'dashboard', url: 'https://codepen.io/uiswarup/pen/eYXNPRv', target: '_blank' },
                { label: 'ui Kit', url: 'https://codepen.io/uiswarup/pen/yLwNOqX', target: '_blank' },
                { label: 'fish animation', url: 'https://codepen.io/uiswarup/pen/dywmxmL', target: '_blank' },
                { label: 'Galaxy', url: 'https://codepen.io/uiswarup/pen/ExGNQVY', target: '_blank' },
                { label: 'Error 404', url: 'https://codepen.io/uiswarup/pen/XWdXGGV', target: '_blank' },
                { label: 'Lord Ganesha', url: 'https://codepen.io/uiswarup/details/abNBGKL', target: '_blank' },
                { label: 'Prcing Table', url: 'https://codepen.io/uiswarup/pen/xxZrLGp', target: '_blank' },
                { label: 'New Login', url: 'https://codepen.io/uiswarup/pen/zYvGKed', target: '_blank' },
                { label: 'Creative Section Design', url: 'https://codepen.io/uiswarup/pen/ExjrZzV', target: '_blank' },
                { label: 'svg loader', url: 'https://codepen.io/uiswarup/pen/JjdegRO', target: '_blank' },
                { label: '404 Error', url: 'https://codepen.io/uiswarup/pen/dyoyLOp', target: '_blank' },
                { label: 'dust particle', url: 'https://codepen.io/uiswarup/pen/oNXYNOB', target: '_blank' },
                { label: 'Creative Hexagon with Hover Effect', url: 'https://codepen.io/uiswarup/pen/ExjZrdQ', target: '_top' },
                { label: 'Birthday Card', url: 'https://codepen.io/uiswarup/pen/zYxPdzG', target: '_top' },
                { label: 'Alert Message', url: 'https://codepen.io/uiswarup/pen/RwNraeW', target: '_top' },
                { label: 'happy new year', url: 'https://codepen.io/uiswarup/pen/JjojQby', target: '_top' },
                { label: 'menu with awesome hover', url: 'https://codepen.io/uiswarup/pen/dyyqaGR', target: '_top' },
                { label: 'Mobile Menu', url: 'https://codepen.io/uiswarup/pen/ExJavGG', target: '_top' },
                { label: 'awesome slider', url: 'https://codepen.io/uiswarup/pen/LXYwwW', target: '_top' },
                { label: 'Animated Background', url: 'https://codepen.io/uiswarup/pen/RBrzpZ', target: '_blank' },
                { label: 'border-animation-css', url: 'https://codepen.io/uiswarup/pen/RBByzW', target: '_blank' }

            ];

            var settings = {

                entries: entries,
                width: 640,
                height: 480,
                radius: '65%',
                radiusMin: 75,
                bgDraw: true,
                bgColor: '#111',
                opacityOver: 1.00,
                opacityOut: 0.05,
                opacitySpeed: 6,
                fov: 800,
                speed: 2,
                fontFamily: 'Oswald, Arial, sans-serif',
                fontSize: '15',
                fontColor: '#fff',
                fontWeight: 'normal',//bold
                fontStyle: 'normal',//italic 
                fontStretch: 'normal',//wider, narrower, ultra-condensed, extra-condensed, condensed, semi-condensed, semi-expanded, expanded, extra-expanded, ultra-expanded
                fontToUpperCase: true

            };

            //var svg3DTagCloud = new SVG3DTagCloud( document.getElementById( 'holder'  ), settings );
            $( '#tag-cloud' ).svg3DTagCloud( settings );

		} );