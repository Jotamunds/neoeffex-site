/* Geometria pura: valida o contorno visível, não pixels de um navegador.
 * Gramática intencionalmente restrita: M, uma ou mais C, L, L, Z.
 */
import assert from "node:assert/strict";

export function parseContour(path) {
    const tokens = path.trim().split(/\s+/);
    let cursor = 0;
    const command = (expected) => assert.equal(tokens[cursor++], expected, `Comando esperado: ${expected}`);
    const point = () => [0, 1].map(() => {
        const token = tokens[cursor++];
        assert.match(token ?? "", /^-?\d+(?:\.\d+)?$/, "Coordenada inválida");
        const value = Number(token);
        assert.ok(Number.isFinite(value), "Coordenada não finita");
        return value;
    });

    command("M");
    const start = point();
    const segments = [];
    let previous = start;

    while (tokens[cursor] === "C") {
        command("C");
        const segment = [previous, point(), point(), point()];
        segments.push(segment);
        previous = segment[3];
    }

    assert.ok(segments.length > 0, "Falta curva cúbica");
    command("L");
    const rightBottom = point();
    command("L");
    const leftBottom = point();
    command("Z");
    assert.equal(cursor, tokens.length, "Mais de um contorno ou comandos extras");
    return { start, segments, rightBottom, leftBottom };
}

function close(actual, expected, message) {
    assert.ok(Math.abs(actual - expected) <= 1e-8 * Math.max(1, Math.abs(actual), Math.abs(expected)), message);
}

function tangent(segment, end) {
    const [a, b] = end ? [segment[2], segment[3]] : [segment[0], segment[1]];
    return a.map((value, axis) => 3 * (b[axis] - value));
}

function acceleration(segment, end) {
    const [a, b, c] = end ? segment.slice(1) : segment.slice(0, 3);
    return a.map((value, axis) => 6 * (c[axis] - 2 * b[axis] + value));
}

export function validateContour(curve, width = 1440, height = 100) {
    assert.ok(Number.isFinite(width) && width > 0 && Number.isFinite(height) && height > 0);
    close(curve.start[0], 0, "Início fora da lateral esquerda");
    close(curve.segments.at(-1)[3][0], width, "Final fora da lateral direita");
    assert.deepEqual(curve.rightBottom, [width, height], "Fechamento inferior direito incorreto");
    assert.deepEqual(curve.leftBottom, [0, height], "Fechamento inferior esquerdo incorreto");

    for (const [index, segment] of curve.segments.entries()) {
        assert.deepEqual(segment[0], index === 0 ? curve.start : curve.segments[index - 1][3], "Curva desconectada");

        for (const [pointIndex, [x, y]] of segment.entries()) {
            assert.ok(Number.isFinite(x) && Number.isFinite(y), "Coordenada não finita");
            assert.ok(x >= 0 && x <= width && y > 0 && y < height, "Controles fora do SVG");

            if (pointIndex > 0) {
                assert.ok(x > segment[pointIndex - 1][0], "Controle X deve avançar: evita cúspides e auto-interseção");
            }
        }

        if (index > 0) {
            const previous = curve.segments[index - 1];

            for (const axis of [0, 1]) {
                close(tangent(previous, true)[axis], tangent(segment, false)[axis], "Quebra de tangente (primeira derivada)");
                close(acceleration(previous, true)[axis], acceleration(segment, false)[axis], "Quebra de suavidade (segunda derivada)");
            }
        }
    }

    close(tangent(curve.segments[0], false)[1], 0, "Início sem tangente horizontal");
    close(tangent(curve.segments.at(-1), true)[1], 0, "Final sem tangente horizontal");
}

export function scaleContour(curve, scaleX, scaleY) {
    const point = ([x, y]) => [x * scaleX, y * scaleY];
    return {
        start: point(curve.start),
        segments: curve.segments.map((segment) => segment.map(point)),
        rightBottom: point(curve.rightBottom),
        leftBottom: point(curve.leftBottom)
    };
}

export function sampleSegment(segment, t) {
    assert.ok(t >= 0 && t <= 1);
    const weights = [(1 - t) ** 3, 3 * (1 - t) ** 2 * t, 3 * (1 - t) * t ** 2, t ** 3];
    return [0, 1].map((axis) => segment.reduce((sum, point, index) => sum + weights[index] * point[axis], 0));
}
