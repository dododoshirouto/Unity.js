/****************************************************/
/**                     ref.js                     **/
/**                                                **/
/** Add useful functions to existing javaScript.   **/
/**                                                **/
/**                     writen by super_amateur_c  **/
/**                                    2021.09.12  **/
/****************************************************/

Math.clip = Math.clamp = function(val, max=1, min=0) {
    return Math.min( Math.max(min, max), Math.max( Math.min(min, max), val ) );
}
Math.clamp01 = function(val) { return Math.clip(val, 1, 0); }
Math.rate = Math.lerp = function(a, b, t) {
    return a + (b - a)*t;
}
Math.lerpAngle = function(a, b, t) {
    let delta = Math.repeat((b - a), 360);
    if (delta  > 180) delta -= 360;
    return a + delta * Math.clamp01(t);
}
Math.repeat = function(t, leng) { return clamp(t - Math.floor(t / leng) * leng, 0, leng); }
Math.getRate = Math.inverseLerp = function(a, b, v) {
    return (v - a) / (b - a);
}
Math.moveTowards = function(a, b, maxSpeed) {
    if (Math.abs(b - a) <= maxSpeed) return target;
    else return a + Math.sign(b - a) * maxSpeed;
}
Math.moveTowardsAngle = function(a, b, maxSpeed) {
    let deltaAngle = Math.deltaAngle(a, b);
    if (-maxSpeed < deltaAngle && deltaAngle < maxSpeed) return b;
    b = a + deltaAngle;
    return MoveTowards(a, b, maxSpeed);
}
Math.deltaAngle = function(a, b) {
    let delta = Mathf.Repeat((b - a), 360);
    if (delta > 180) delta -= 360;
    return delta;
}
Math.smoothStep = function(a, b, t) {
    t = Math.clamp01(t);
    t = -2 * t * t * t + 3 * t * t;
    return to * t + from * (1 - t);
}
Math.pingPong = function(t, leng) {
    t = Math.repeat(t, leng * 2);
    return leng - Math.abs(t - leng);
}
Math.normalizedRandom = function(normalize=3) {
    let rnd = 0;
    for (let i=0; i<Math.abs(normalize); i=(0|i+1)) {
        rnd += Math.random();
    }
    rnd /= Math.abs(normalize);
    return (normalize<0? Math.ceil(rnd*2)/2 - rnd + Math.floor(rnd*2)/2: rnd);
}
// Math.closestPowerOfTwo(val) {}

Math.deg2rad = Math.PI / 180;
Math.rad2deg = 180 / Math.PI;

String.prototype.format = function(...val) {
    var output = this;
    for (let i=0; i<val.length; i=(0|i+1)) {
        output = output.split('$'+(i+1)).join(val[i]);
    }
    return output;
}

String.prototype.easyHash = function() {
    var hash = 0;
    for (var i = 0; i < this.length; i++) {
        hash = ~~(((hash << 5) - hash) + this.charCodeAt(i));
    }
    return hash;
}

Array.prototype.random = function(offset=0) {
    if (offset>0) return this[Math.min(this.length-1, Math.max(0, Math.floor( Math.random()* Math.min(this.length, Math.max(0, offset))) ))];
    else return this[Math.min(this.length-1, Math.max(0, Math.floor(Math.random() * (this.length-Math.abs(offset))) ))];
}
Array.prototype.first = function() {
    return this[0];
}
Array.prototype.last = function() {
    return this[this.length-1];
}

/// 驟榊�縺ｮ縺ｿ隍�｣ｽ�磯｣諠ｳ驟榊�縺ｨ繧ｪ繝悶ず繧ｧ繧ｯ繝医�蜿ら���
Array.prototype.shadowCopy = function() {
    return this.concat();
}
/// 縺吶∋縺ｦ隍�｣ｽ
Array.prototype.deepCopy = function() {
    return JSON.parse(JSON.stringify(this));
}


Date.daysStrJp = [ "譌･", "譛�", "轣ｫ", "豌ｴ", "譛ｨ", "驥�", "蝨�" ];
Date.daysFullStrJp = [ "譌･譖懈律", "譛域屆譌･", "轣ｫ譖懈律", "豌ｴ譖懈律", "譛ｨ譖懈律", "驥第屆譌･", "蝨滓屆譌･" ];
Date.daysStr = [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ];
Date.daysFullStr = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ];

Date.format = function(str='\\TIMESTAMP') { return (new Date).format(str); };
Date.prototype.format = function(str='\\TIMESTAMP') {
    var output = str;
    output = output.split('\\TIMESTAMP').join(
        this.getFullYear() +'-'+
        ('0'+(this.getMonth()+1)).slice(-2) +'-'+
        ('0'+this.getDate()).slice(-2) +' '+
        ('0'+this.getHours()).slice(-2) +':'+
        ('0'+this.getMinutes()).slice(-2) +':'+
        ('0'+this.getSeconds()).slice(-2)
    );

    output = output.split('\\DAYS').join( Date.daysFullStr[this.getDay()].toUpperCase() );
    output = output.split('\\Days').join( Date.daysFullStr[this.getDay()] );
    output = output.split('\\days').join( Date.daysFullStr[this.getDay()].toLowerCase() );
    output = output.split('\\DAY').join( Date.daysStr[this.getDay()].toUpperCase() );
    output = output.split('\\Day').join( Date.daysStr[this.getDay()] );
    output = output.split('\\day').join( Date.daysStr[this.getDay()].toLowerCase() );

    output = output.split('\\YYYY').join( this.getFullYear() );
    output = output.split('\\YY').join( this.getYear() );
    output = output.split('\\MM').join( ('0'+(this.getMonth()+1)).slice(-2) );
    output = output.split('\\M').join( this.getMonth()+1 );
    output = output.split('\\DD').join( ('0'+this.getDate()).slice(-2) );
    output = output.split('\\D').join( this.getDate() );

    output = output.split('\\hh').join( ('0'+this.getHours()).slice(-2) );
    output = output.split('\\h').join( this.getHours() );
    output = output.split('\\ms').join( ('00'+this.getMilliseconds()).slice(-3) );
    output = output.split('\\mm').join( ('0'+this.getMinutes()).slice(-2) );
    output = output.split('\\m').join( this.getMinutes() );
    output = output.split('\\ss').join( ('0'+this.getSeconds()).slice(-2) );
    output = output.split('\\s').join( this.getSeconds() );

    return output;
}


// 繧ｹ繝槭�縺九←縺�°縺ｮ蛻､螳�
// https://www.site-convert.com/archives/2188
function isSmartPhone() {
    // if (navigator.userAgent.match(/iPhone|iPod|iPad|Android/)) { // 繧ｿ繝悶Ξ繝�ヨ蜷ｫ繧
    if (navigator.userAgent.match(/iPhone|iPod|Android.+Mobile/)) {
        return true;
    } else {
        return false;
    }
}
function isTablet() {
    if (navigator.userAgent.match(/iPad|Android/) && !navigator.userAgent.match(/Android.+Moblie/)) {
        return true;
    } else {
        return false;
    }
}
function isPC() { return !(isSmartPhone() || isTablet()); }

function changeInputNumbrIsMobile(clickSelect=false) {
    if (isPC()) return;
    let elms = document.querySelectorAll('input[type=number]');
    for (let i=0; i<elms.length; i=(0|i+1)) {
        elms[i].setAttribute('type', 'tel');
        if (clickSelect) elms[i].addEventListener('click', ev=>{console.log(ev.target.select());});
    }
}


// https://qiita.com/hoo-chan/items/49654d983bc4fd763bab
function generateCubicBezier(x1=0.42, y1=0, x2=0.58, y2=1.0, step) {
    const table = generateTable(x1, x2, step);
    const tableSize = table.length;
    cubicBezier.getT = getT;
    cubicBezier.table = table;
    return cubicBezier;
    function cubicBezier(x) {
        if (x <= 0) {
            return 0;
        }
        if (1 <= x) {
            return 1;
        }
        return getCoordinate(y1, y2, getT(x));
    }
    function getT(x) {
        let xt1, xt0;
        if (x < 0.5) {
            for (let i = 1; i < tableSize; i++) {
                xt1 = table[i];
                if (x <= xt1[0]) {
                    xt0 = table[i - 1];
                    break;
                }
            }
        } else {
            for (let i = tableSize - 1; i--;) {
                xt1 = table[i];
                if (xt1[0] <= x) {
                    xt0 = table[i + 1];
                    break;
                }
            }
        }
        return xt0[1] + (x - xt0[0]) * (xt1[1] - xt0[1]) / (xt1[0] - xt0[0]);
    }
    function getCoordinate(z1, z2, t) {
        return (3 * z1 - 3 * z2 + 1) * t * t * t + (-6 * z1 + 3 * z2) * t * t + 3 * z1 * t;
    }
    function generateTable(x1, x2, step) {
        step = step || 1 / 30;
        const table = [[0, 0]];
        for (let t = step, previousX = 0; t < 1; t += step) {
            const x = getCoordinate(x1, x2, t);
            if (previousX < x) {
                table.push([x, t]);
                previousX = x;
            }
        }
        table.push([1, 1]);
        return table;
    }
}


function queryAddEventListeners(elemsarr, action, func) {
    let acs = action.trim().split(' ');
    for (let i=0; i<elemsarr.length; i++) {
        for (let ii=0; ii<acs.length; ii++) {
            elemsarr[i].addEventListener(acs[ii], func);
        }
    }
}
function queryRemoveEventListeners(elemsarr, action, func) {
    let acs = action.trim().split(' ');
    for (let i=0; i<elemsarr.length; i++) {
        for (let ii=0; ii<acs.length; ii++) {
            elemsarr[i].removeEventListener(acs[ii], func);
        }
    }
}


function execCopy(string) {
    var tmp = document.createElement("div");
    var pre = document.createElement('pre');
    pre.style.webkitUserSelect = 'auto';
    pre.style.userSelect = 'auto';
    tmp.appendChild(pre).textContent = string;
    var s = tmp.style;
    s.position = 'fixed';
    s.right = '200%';
    document.body.appendChild(tmp);
    document.getSelection().selectAllChildren(tmp);
    document.execCommand("copy");
    document.body.removeChild(tmp);
}





class Vector2 {
    constructor(x=0, y=0) {
        this.x = x;
        this.y = y;
    }
    clone() { return new Vector2(this.x, this.y); }
    set(x, y) { this.x = x; this.y = y; return this; }
    copy(src) { return this.set(src.x, src.y); }

    static get zero  (){ return new Vector2( 0,  0); }
    static get one   (){ return new Vector2( 1,  1); }
    static get up    (){ return new Vector2( 0,  1); }
    static get down  (){ return new Vector2( 0, -1); }
    static get left  (){ return new Vector2(-1,  0); }
    static get right (){ return new Vector2( 1,  0); }

    Lerp(b, t) { return this.copy( Vector2.lerp(this, b, t) ); }
    static Lerp(a, b, t) { return new Vector2( a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t ); }
    moveTowards(target, maxDistanceDelta) { return this.copy(Vector2.moveTowards(this, target, maxDistanceDelta)); }
    static moveTowards(current, target, maxDistanceDelta) {
        let toVector_x = target.x - current.x;
        let toVector_y = target.y - current.y;
        let sqDist = toVector_x * toVector_x + toVector_y * toVector_y;
        if (sqDist == 0 || (maxDistanceDelta >= 0 && sqDist <= maxDistanceDelta * maxDistanceDelta)) return target;
        let dist = Math.sqrt(sqDist);
        return new Vector2(current.x + toVector_x / dist * maxDistanceDelta, current.y + toVector_y / dist * maxDistanceDelta);
    }
    scale(vector) { return this.set(this.x * vector.x, this.y * vector.y); }
    normalize() {
        let mag = this.magnitude();
        if (mag > 0) return this.div(mag);
        else return this.copy( Vector2.zero );
    }
    reflect(inNormal)  {
        let factor = -2 * Vector2.dot(inNormal, this);
        return this.set(factor * inNormal.x + this.x, factor * inNormal.y + this.y);
    }
    perpendicular() { return this.set(-this.y, this.x); } // 蝙ら峩
    static dot(va, vb) { return va.x * vb.x + va.y * vb.y; }
    magnitude() { return Math.sqrt(this.sqrMagnitude()); }
    sqrMagnitude() { return this.x * this.x + this.y * this.y; }
    static Angle(from, to) {
        let denominator = Math.sqrt(from.sqrMagnitude() * to.sqrMagnitude());
        if (denominator == 0) return 0;
        let dot = Math.clamp(Vector2.dot(from, to) / denominator, -1, 1);
        return Math.acos(dot) * Math.rad2deg;
    }
    static signedAngle(from, to) {
        let unsigned_angle = Vector2.angle(from, to);
        let sign = Math.sign(from.x * to.y - from.y * to.x);
        return unsigned_angle * sign;
    }
    static distance(va, vb){ return Math.sqrt( Math.pow(va.x-vb.x, 2) + Math.pow(va.y-vb.y, 2) ); };
    clampMagnitude(leng) {
        let mag = this.magnitude();
        if (mag > leng) return this.set(leng * this.x / mag, leng * this.y / mag);
        return this;
    }
    static min(va, vb) { return new Vector2(Math.min(va.x, vb.x), Math.min(va.y, vb.y)); }
    static max(va, vb) { return new Vector2(Math.max(va.x, vb.x), Math.max(va.y, vb.y)); }

    add(other) { this.x += other.x; this.y += other.y; return this; }
    static add(a, b) { return new Vector2( a.x + b.x, a.y + b.y ); }
    sub(other) { this.x -= other.x; this.y -= other.y; return this; }
    static sub(a, b) { return new Vector2( a.x - b.x, a.y - b.y ); }
    mul(scale) { this.x *= scale; this.y *= scale; return this; }
    static mul(vector, scale) { return new Vector2( vector.x * scale, vector.y * scale ); }
    div(scale) { this.x /= scale; this.y /= scale; return this; }
    static div(vector, scale) { return new Vector2( vector.x / scale, vector.y / scale ); }
    reverse() { return this.mul(-1); }
    static reverse(vector) { return Vector2.mul(vector, -1); }

    static equal(a, b) { return a.x == b.x && a.y == b.y; }
    equal(other) { return this.x == other.x && this.y == other.y; }

    toString(fixed=2, format='Vector2($1,$2)') { return format.format(this.x.toFixed(fixed), this.y.toFixed(fixed)); }
}


class Times {
  static time = 0;
  static lastTime = 0;
  static deltaTime = 0;
  
  static startDeltaTime() {
    Times.time = Date.now()*0.001;
    if(Times.lastTime==0)Times.lastTime = Times.time;
  }
  static endDeltaTime() {
    Times.lastTime = Times.time;
    Times.time = Date.now()*0.001;
    if(Times.lastTime==0)Times.lastTime = Times.time;
    Times.deltaTime = Times.time - Times.lastTime;
  }
}





class Darkmode {
    static colors = {
        day : {
            main: '#444444',
            background: '#FFFFFF',
            primary: '#7A8289',
            secondary: '#EDEEF1',
            color: '#1BBBDE',
            activeColor: '#07acd0',
            red: '#E30319',
        },
        dark : {
            main: '#F7F7F7',
            background: '#262626',
            primary: '#D9D9D9',
            secondary: '#323232',
            color: '#FE9F0A',
            activeColor: '#ffc569',
            red: '#F1114D',
        },
    };

    static setDarkmodableOptionalStyle(str) {
        if (typeof autoCreatedStyle == 'undefined') document.body.innerHTML = '<style id="autoCreatedStyle"></style>' + document.body.innerHTML;
        autoCreatedStyle.innerHTML += str;
    }

    static setDarkmodableStyle(selector, property, color, format="$1") {
        if (typeof autoCreatedStyle == 'undefined') document.body.innerHTML = '<style id="autoCreatedStyle"></style>' + document.body.innerHTML;
        autoCreatedStyle.innerHTML += selector +" { "+ property +" : "+ format.format(Darkmode.colors.day[color]) +"; }\n";
        selector = selector.split(',').map(v=>v.trim()).join(', body.darkmode ');
        autoCreatedStyle.innerHTML += "body.darkmode "+ selector +" { "+ property +" : "+ format.format(Darkmode.colors.dark[color]) +"; }\n";
    }

    static setDarkmodableStyleBody(property, color, format="$1") {
        if (typeof autoCreatedStyle == 'undefined') document.body.innerHTML = '<style id="autoCreatedStyle"></style>' + document.body.innerHTML;
        autoCreatedStyle.innerHTML += "body { "+ property +" : "+ format.format(Darkmode.colors.day[color]) +"; }\n";
        autoCreatedStyle.innerHTML += "body.darkmode { "+ property +" : "+ format.format(Darkmode.colors.dark[color]) +"; }\n";
    }

    static resetDarkmodableStyle() { if (typeof autoCreatedStyle != 'undefined') autoCreatedStyle.innerHTML = ''; }

    static checkDarkmodeActive() { document.body.classList.toggle('darkmode', window.matchMedia('(prefers-color-scheme: dark)').matches == true); }

    static setDarkmodableClassStyle() {
        Darkmode.resetDarkmodableStyle();
        Darkmode.checkDarkmodeActive();

        let color_scheme = ['main','background','primary','secondary','color','activeColor','red'];
        let property_scheme = ['color','background-color','border-color'];
        for (let i=0; i<color_scheme.length; i++) {
            for (let ii=0; ii<property_scheme.length; ii++) {
                Darkmode.setDarkmodableStyle('.'+color_scheme[i]+'_'+property_scheme[ii].split('-')[0], property_scheme[ii], color_scheme[i]);
                Darkmode.setDarkmodableStyleBody('.'+color_scheme[i]+'_'+property_scheme[ii].split('-')[0], property_scheme[ii], color_scheme[i]);
            }
        }
    }

    static setDefaultDarkmodableStyle() {

        Darkmode.resetDarkmodableStyle();
        Darkmode.checkDarkmodeActive();

        Darkmode.setDarkmodableOptionalStyle(
`* {
        font-feature-settings: "palt" 1;
        text-decoration: none;
        appearance: none;
        -moz-appearance: none;
        -webkit-appearance: none;

        box-sizing: border-box;
        object-fit: cover;
        background-size: cover;
        font-family: sans-serif;

        transition-property: color, background-color;
        transition-duration: 180ms;
        transition-timing-function: ease-in-out;
    }

    button, input, select, textarea {
        border-width: 1px;
        border-radius: 4px;
    }

    input:not([type=button]):not([type=submit]):not([type=checkbox]):not([type=radio]),
    textarea,
    select {
        padding: 3px 8px;
    }

    select {
        min-width: 6em;
    }

    *[onclick], label {
        cursor: pointer;
    }

    input[type=submit] {
        border: none;
        color: #FFF;
        padding: 0.5em 2em;
        font-size: 1.2rem;
        width: calc(100% - 2em);
        width: 80%;
        max-width: 760px;
        margin-top: 1em;
    }
    input[type=range] {
        height: 2px;
    }
    input[type=checkbox], input[type=radio] {
        width: 1em;
        height: 1em;
        border-radius: 0.2em;
        border-width: 4px;
        border-style: solid;
        cursor: pointer;
    }
    input[type=radio] {
        border-radius: 100%;
    }

    label {
        display: block;
        font-weight: bold;
    }

    label+* {
        margin-left: 1rem;
        display: block;
    }

    input[type=checkbox]:checked+label,
    input[type=radio]:checked+label {
        color: red;
        font-weight: bold;
    }


    div#toggledarkmode>div {
        position: absolute;
        width: 1.6em;
        height: 1.4em;
        /*background-color: #fc6;*/
        border-radius: 2em;
        left: 0em;
        transition: left 230ms ease-in-out;
    }
    body.darkmode div#toggledarkmode>div {
        left: 1em;
    }

    div#toggledarkmode {
        position: relative;
        margin: 1em;
        /*background-color: #ddd;*/
        width: 3em;
        height: 1.8em;
        border-radius: 2em;
        border-width: 0.2em;
        /*border-color: #fff;*/
        border-style: solid;
    }

    #toggledarkmode svg {
        position: absolute;
        width: 1em;
        height: 1em;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    a:-webkit-any-link, a[hreh], a[onclick] {
        text-decoration: underline;
        cursor: pointer;
    }`);

        Darkmode.setDarkmodableStyleBody('background-color', 'background');
        Darkmode.setDarkmodableStyle('*', 'color', 'main');
        Darkmode.setDarkmodableStyle('button, input, select, textarea', 'background-color', 'background');
        Darkmode.setDarkmodableStyle('button:hover, input:hover, select:hover, textarea:hover', 'background-color', 'secondary');
        Darkmode.setDarkmodableStyle('button, input, select, textarea', 'border-color', 'primary');

        Darkmode.setDarkmodableStyle('input[type=submit]', 'background-color', 'color');
        Darkmode.setDarkmodableStyle('input[type=submit]:hover', 'background-color', 'activeColor');
        Darkmode.setDarkmodableStyle('input[type=submit][disabled]', 'background-color', 'secondary');
        Darkmode.setDarkmodableStyle('input[type=submit][disabled]', 'color', 'primary');

        Darkmode.setDarkmodableStyle('input[type=checkbox], input[type=radio]', 'border-color', 'primary');
        Darkmode.setDarkmodableStyle('input[type=checkbox]:checked, input[type=radio]:checked', 'background-color', 'color');
        Darkmode.setDarkmodableStyle('input[type=checkbox]:checked, input[type=radio]:checked', 'border-color', 'activeColor');
        Darkmode.setDarkmodableStyle('input[type=checkbox]:checked:hover, input[type=radio]:checked:hover', 'background-color', 'activeColor');

        Darkmode.setDarkmodableStyle('input[type=checkbox]:checked+label,input[type=radio]:checked+label', 'color', 'color');

        Darkmode.setDarkmodableStyle('input[type=checkbox]+label:hover, input[type=radio]+label:hover', 'color', 'primary');
        Darkmode.setDarkmodableStyle('input[type=checkbox]:checked+label:hover, input[type=radio]:checked+label:hover', 'color', 'activeColor');

        Darkmode.setDarkmodableStyle('.color-red, .error, .errors', 'color', 'red');

        Darkmode.setDarkmodableStyle('a:-webkit-any-link, a[hreh], a[onclick]', 'color', 'activeColor');
        Darkmode.setDarkmodableStyle('a:-webkit-any-link:hover, a[hreh]:hover, a[onclick]:hover', 'color', 'color');


        Darkmode.setDarkmodableStyle('#toggledarkmode', 'border-color', 'primary');
        Darkmode.setDarkmodableStyle('#toggledarkmode', 'background-color', 'color');
        Darkmode.setDarkmodableStyle('#toggledarkmode>div', 'background-color', 'main');
        Darkmode.setDarkmodableStyle('.darkmode-switch-icon', 'fill', 'color');
    }
}