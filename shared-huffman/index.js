// Build frequency map
export function buildFrequencyMap(str) {
  const freq = {};
  for (const char of str) {
    freq[char] = (freq[char] || 0) + 1;
  }
  return freq;
}

// Build tree
export function buildHuffmanTree(freqMap) {
  const nodes = Object.entries(freqMap).map(([char, freq]) => ({ char, freq }));
  while (nodes.length > 1) {
    nodes.sort((a, b) => a.freq - b.freq);
    const left = nodes.shift();
    const right = nodes.shift();
    nodes.push({ freq: left.freq + right.freq, left, right });
  }
  return nodes[0];
}

// Generate codes
export function generateCodes(tree, path = "", map = {}) {
  if (!tree.left && !tree.right) {
    map[tree.char] = path;
  } else {
    if (tree.left) generateCodes(tree.left, path + "0", map);
    if (tree.right) generateCodes(tree.right, path + "1", map);
  }
  return map;
}

// Encode string
export function encode(str, codeMap) {
  return str.split("").map((c) => codeMap[c]).join("");
}

// Decode string
export function decode(encoded, tree) {
  let result = "";
  let node = tree;
  for (const bit of encoded) {
    node = bit === "0" ? node.left : node.right;
    if (!node.left && !node.right) {
      result += node.char;
      node = tree;
    }
  }
  return result;
}
