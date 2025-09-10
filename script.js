
window.onload = function() {
    gsap.to('.title', {
        duration: 2,
        filter: 'blur(0px)',
        scrambleText: "GONIOMETRICKÉ FUNKCIE",
        ease: 'expo.inOut'
    })
    gsap.to('.title', {
        duration: 1.2,
        delay: 2.6,
        'transform': 'translateY(-45%) scale(0.3)',
        ease: "elastic.out(0.11,0.1)"
    })
    gsap.to('.explanation', {
        filter: 'blur(0px)',
        duration: 1.5,
        delay: 3.5,
        opacity: 1,
        ease: "expo.out"
    })
    gsap.to('.inline', {
        filter: 'blur(0px)',
        duration: 1.5,
        delay: 3.5,
        opacity: 1,
        ease: "expo.out"
    })
};

function angleToX(angle, angleMin, angleMax, WIDTH) {
    return (angle - angleMin) / (angleMax - angleMin) * WIDTH;
}

function drawGrid(ctx, {
    WIDTH = 200,
    HEIGHT = 200,
    MID_Y = 100,
    SCALE = 50,
    angleMin = 0,
    angleMax = 2 * Math.PI,
    showAsymptotes = false
} = {}) {
    ctx.save();
    ctx.strokeStyle = '#d9d9d9ff';
    ctx.lineWidth = 1;
    ctx.setLineDash([]);

    const yTicks = [1, 0, -1];
    yTicks.forEach(v => {
        const y = MID_Y - SCALE * v;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(WIDTH, y);
        ctx.stroke();
    });

    const degTicks = [0, 90, 180, 270, 360];
    degTicks.forEach(d => {
        const a = d * Math.PI / 180;
        const x = angleToX(a, 0, 2 * Math.PI, WIDTH);
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, HEIGHT);
        ctx.stroke();
    });

    if (showAsymptotes) {
        const asym = [0.5 * Math.PI, 1.5 * Math.PI];
        ctx.save();
        ctx.strokeStyle = '#cccccc';
        ctx.setLineDash([4, 4]);
        asym.forEach(a => {
            const x = angleToX(a, 0, 2 * Math.PI, WIDTH);
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, HEIGHT);
            ctx.stroke();
        });
        ctx.restore();
    }

    ctx.fillStyle = '#666666';
    ctx.font = '10px Space Grotesk, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    degTicks.forEach(d => {
        const a = d * Math.PI / 180;
        const x = angleToX(a, 0, 2 * Math.PI, WIDTH);
        ctx.fillText(`${d}°`, Math.min(WIDTH - 8, Math.max(8, x)), HEIGHT - 2);
    });

    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    yTicks.forEach(v => {
        const y = MID_Y - SCALE * v;
        ctx.fillText(`${v}`, WIDTH - 2, y);
    });

    ctx.restore();
}

function drawRoundedRect(ctx, x, y, w, h, r) {
    const min = Math.min(w, h) / 2;
    if (r > min) r = min;
    const x0 = x - w / 2;
    const y0 = y - h / 2;
    ctx.beginPath();
    ctx.moveTo(x0 + r, y0);
    ctx.lineTo(x0 + w - r, y0);
    ctx.quadraticCurveTo(x0 + w, y0, x0 + w, y0 + r);
    ctx.lineTo(x0 + w, y0 + h - r);
    ctx.quadraticCurveTo(x0 + w, y0 + h, x0 + w - r, y0 + h);
    ctx.lineTo(x0 + r, y0 + h);
    ctx.quadraticCurveTo(x0, y0 + h, x0, y0 + h - r);
    ctx.lineTo(x0, y0 + r);
    ctx.quadraticCurveTo(x0, y0, x0 + r, y0);
    ctx.closePath();
}

function drawLabel(ctx, text, x, y, options = {}) {
    const {
        font = 'bold 14px Space Grotesk, sans-serif',
        color = '#111',
        bg = 'rgba(255,255,255,0.95)',
        border = '#00000020',
        paddingX = 6,
        paddingY = 3,
        radius = 4,
        clampRect = { x: 0, y: 0, width: 200, height: 200 },
    } = options;

    ctx.save();
    ctx.font = font;
    const m = ctx.measureText(text);
    const ascent = m.actualBoundingBoxAscent || 9;
    const descent = m.actualBoundingBoxDescent || 3;
    const textW = Math.max(0, m.width);
    const textH = ascent + descent;
    let w = textW + paddingX * 2;
    let h = textH + paddingY * 2;

    const minX = clampRect.x + w / 2 + 1;
    const maxX = clampRect.x + clampRect.width - w / 2 - 1;
    const minY = clampRect.y + h / 2 + 1;
    const maxY = clampRect.y + clampRect.height - h / 2 - 1;
    let cx = Math.min(maxX, Math.max(minX, x));
    let cy = Math.min(maxY, Math.max(minY, y));

    drawRoundedRect(ctx, cx, cy, w, h, radius);
    ctx.fillStyle = bg;
    ctx.fill();
    if (border) {
        ctx.strokeStyle = border;
        ctx.lineWidth = 1;
        ctx.stroke();
    }

    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, cx, cy + (ascent - textH / 2) * 0);
    ctx.restore();
}

const sineCanvas = document.getElementById("sine-canvas");
const sinectx = sineCanvas.getContext("2d");

function drawSine() {
    sinectx.fillStyle = "white";
    sinectx.fillRect(0,0,200,200);

    const WIDTH = 200;
    const HEIGHT = 200;
    const MID_Y = 100;
    const SCALE = 50;
    const ANGLE_MIN = 0;
    const ANGLE_MAX = 2 * Math.PI;
    const xToAngle = (x) => ANGLE_MIN + (x / WIDTH) * (ANGLE_MAX - ANGLE_MIN);

    drawGrid(sinectx, { WIDTH, HEIGHT, MID_Y, SCALE, angleMin: 0, angleMax: 2 * Math.PI });

    sinectx.beginPath();
    sinectx.lineWidth = 5;
    for (let x = 0; x <= WIDTH; x++) {
        const theta = xToAngle(x);
        const y = MID_Y - SCALE * Math.sin(theta);
        if (x === 0) sinectx.moveTo(x, y); else sinectx.lineTo(x, y);
    }
    sinectx.stroke();

    let thetaStd = progress - Math.PI / 2;
    thetaStd = ((thetaStd % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    const xDotSine = WIDTH * (thetaStd / (2 * Math.PI));
    const yDot = MID_Y - SCALE * Math.sin(thetaStd);
    sinectx.beginPath();
    sinectx.arc(xDotSine, yDot, 7, 0, 2 * Math.PI);
    sinectx.fillStyle = "black";
    sinectx.fill();
}

setInterval(drawSine, 10)

const cosineCanvas = document.getElementById("cosine-canvas");
const cosctx = cosineCanvas.getContext("2d");

function drawCosine() {
    cosctx.fillStyle = "white";
    cosctx.fillRect(0,0,200,200);

    const WIDTH = 200;
    const HEIGHT = 200;
    const MID_Y = 100;
    const SCALE = 50;
    const ANGLE_MIN = 0;
    const ANGLE_MAX = 2 * Math.PI;
    const xToAngle = (x) => ANGLE_MIN + (x / WIDTH) * (ANGLE_MAX - ANGLE_MIN);

    drawGrid(cosctx, { WIDTH, HEIGHT, MID_Y, SCALE, angleMin: 0, angleMax: 2 * Math.PI });

    cosctx.beginPath();
    cosctx.lineWidth = 5;
    for (let x = 0; x <= WIDTH; x++) {
        const theta = xToAngle(x);
        const y = MID_Y - SCALE * Math.cos(theta);
        if (x === 0) cosctx.moveTo(x, y); else cosctx.lineTo(x, y);
    }
    cosctx.stroke();

    let thetaStd = progress - Math.PI / 2;
    thetaStd = ((thetaStd % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    const xDotCos = WIDTH * (thetaStd / (2 * Math.PI));
    const yDot = MID_Y - SCALE * Math.cos(thetaStd);
    cosctx.beginPath();
    cosctx.arc(xDotCos, yDot, 7, 0, 2 * Math.PI);
    cosctx.fillStyle = "black";
    cosctx.fill();
}

setInterval(drawCosine, 10)

const tangensCanvas = document.getElementById("tangens-canvas");
const tanctx = tangensCanvas.getContext("2d");

function drawTangens() {
    tanctx.fillStyle = "white";
    tanctx.fillRect(0,0,200,200);

    
    const WIDTH = 200;
    const HEIGHT = 200;
    const MID_Y = 100;
    const SCALE = 50;
    const ANGLE_MIN = 0;
    const ANGLE_MAX = 2 * Math.PI;
    const xToAngle = (x) => ANGLE_MIN + (x / WIDTH) * (ANGLE_MAX - ANGLE_MIN);
    const EPS_COS = 0.03;

    drawGrid(tanctx, { WIDTH, HEIGHT, MID_Y, SCALE, angleMin: 0, angleMax: 2 * Math.PI, showAsymptotes: true });

    tanctx.lineWidth = 5;
    tanctx.beginPath();
    let drawing = false;
    for (let x = 0; x <= WIDTH; x++) {
        const theta = xToAngle(x);
        const c = Math.cos(theta);
        if (Math.abs(c) < EPS_COS) { drawing = false; continue; }
        const y = MID_Y - SCALE * Math.tan(theta);
        if (!Number.isFinite(y)) { drawing = false; continue; }
        if (!drawing) { tanctx.moveTo(x, y); drawing = true; }
        else { tanctx.lineTo(x, y); }
    }
    tanctx.stroke();

    
    let thetaStd = progress - Math.PI / 2;
    thetaStd = ((thetaStd % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    const xDotTan = WIDTH * (thetaStd / (2 * Math.PI));
    const cDot = Math.cos(thetaStd);
    const yDotTan = MID_Y - SCALE * Math.tan(thetaStd);
    if (Math.abs(cDot) >= EPS_COS && Number.isFinite(yDotTan) && yDotTan >= 0 && yDotTan <= HEIGHT) {
        tanctx.beginPath();
        tanctx.arc(xDotTan, yDotTan, 7, 0, 2*Math.PI);
        tanctx.fillStyle = "black";
        tanctx.fill();
    }
}

setInterval(drawTangens, 10)

const triangleCanvas = document.getElementById("triangle-canvas");
const trictx = triangleCanvas.getContext("2d");
const triangleTitle = document.getElementById('triangle-title');
const sineTitle = document.getElementById('sine-title');
const cosineTitle = document.getElementById('cosine-title');
const tangentTitle = document.getElementById('tangent-title');

triPosX = 0;
triPosY = 0;
progress = 0;

function drawTriangle() {
    trictx.fillStyle = "white";
    trictx.fillRect(0,0, 200,200);
    triPosX = 100 + 100*Math.sin(progress)
    triPosY = 100 + 100*Math.cos(progress)

    if (progress < 2*Math.PI) {
        progress += Math.PI/200;
    } else {
        progress = 0;
    }
    
    trictx.beginPath();
    trictx.lineWidth = 1;
    trictx.arc(100, 100, 100, 0, 2*Math.PI);
    trictx.strokeStyle = '#d9d9d9ff';
    trictx.moveTo(100, 100);
    trictx.lineTo(0,100);
    trictx.moveTo(100, 100);
    trictx.lineTo(200,100);
    trictx.moveTo(100, 100);
    trictx.lineTo(100,0);
    trictx.moveTo(100, 100);
    trictx.lineTo(100,200);
    trictx.stroke();
    
    trictx.lineWidth = 5;
    trictx.beginPath();
    trictx.moveTo(100,100);
    trictx.lineTo(triPosX, 100);
    trictx.lineTo(triPosX, triPosY);
    trictx.lineTo(100, 100);
    trictx.lineTo(triPosX, 100);
    trictx.strokeStyle = "black";
    trictx.stroke()

    trictx.beginPath();
    trictx.arc(triPosX,triPosY,5,0,2*Math.PI);
    trictx.fillStyle = "black";
    trictx.fill();
    // Labels for sides: a (vertical), b (horizontal), c (hypotenuse)
    const OX = 100, OY = 100;
    const O = { x: OX, y: OY };
    const B = { x: triPosX, y: 100 };
    const P = { x: triPosX, y: triPosY };

    const labelOpts = { font: 'bold 14px Space Grotesk, sans-serif', bg: 'rgba(255,255,255,0.95)', color: '#111', border: '#00000020', paddingX: 6, paddingY: 3, radius: 4, clampRect: { x: 0, y: 0, width: 200, height: 200 } };

    // b: horizontal leg OB — offset AWAY from interior (opposite P) vertically
    const mB = { x: (O.x + B.x) / 2, y: 100 };
    const offsetB = (P.y < 100) ? 14 : -14;
    drawLabel(trictx, 'b', mB.x, mB.y + offsetB, labelOpts);

    // a: vertical leg BP — offset AWAY from interior (opposite O) horizontally
    const mA = { x: triPosX, y: (100 + triPosY) / 2 };
    const offsetA = (triPosX > 100) ? 14 : -14;
    drawLabel(trictx, 'a', mA.x + offsetA, mA.y, labelOpts);

    // c: hypotenuse OP — offset perpendicular AWAY from the interior side (away from B)
    const mC = { x: (O.x + P.x) / 2, y: (O.y + P.y) / 2 };
    const v = { x: P.x - O.x, y: P.y - O.y };
    const len = Math.hypot(v.x, v.y) || 1;
    let n = { x: -v.y / len, y: v.x / len };
    const toB = { x: B.x - mC.x, y: B.y - mC.y };
    if (n.x * toB.x + n.y * toB.y < 0) { n.x = -n.x; n.y = -n.y; }
    // Flip to point outside (away from interior)
    n.x = -n.x; n.y = -n.y;
    const cPos = { x: mC.x + n.x * 14, y: mC.y + n.y * 14 };
    drawLabel(trictx, 'c', cPos.x, cPos.y, labelOpts);

    // Update titles if present
    if (triangleTitle || sineTitle || cosineTitle || tangentTitle) {
        // Convert to standard math angle: 0° at +x axis, CCW positive
        let thetaStd = progress - Math.PI / 2;
        // Normalize to [0, 2π)
        thetaStd = ((thetaStd % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
        const degrees = Math.round(thetaStd * 180 / Math.PI);
        const s = Math.sin(thetaStd);
        const c = Math.cos(thetaStd);
        const t = s / c;

        if (triangleTitle) triangleTitle.textContent = `pravouhlý trojuholník \r\nδ = ${degrees}°`;
        if (sineTitle) sineTitle.textContent = `sínus sin(δ) = ${s.toFixed(3)}`;
        if (cosineTitle) cosineTitle.textContent = `kosínus cos(δ) = ${c.toFixed(3)}`;
        if (tangentTitle) tangentTitle.textContent = Math.abs(c) < 1e-6 ? `tangens = ±∞` : `tangens tg(δ) = ${t.toFixed(3)}`;
    }
}

setInterval(drawTriangle, 10)