import CONVERSATION from "../models/conversation.model.js";
import MESSAGE from "../models/message.model.js";
import USER from "../models/user.model.js";
import { io, getReciverSoketId } from "../utils/socket.js";

import {
  buildFrequencyMap,
  buildHuffmanTree,
  generateCodes,
  encode,
} from "shared-huffman";
export const sendMessage = async (req, res) => {
  try {
    const { content } = req.body;
    const receiver = req.params.id;
    const sender = req.user.id;
    let conversation = await CONVERSATION.findOne({
      participants: { $all: [sender, receiver] },
    });
    if (!conversation) {
      conversation = await CONVERSATION.create({
        participants: [sender, receiver],
      });
    }
    const freqMap = buildFrequencyMap(content);
    const huffmanTree = buildHuffmanTree(freqMap);
    const huffmanCodes = generateCodes(huffmanTree);
    const encodedContent = encode(content, huffmanCodes);

    const newMessage = new MESSAGE({
      sender: sender,
      receiver: receiver,
      content: encodedContent,
      huffmanTree: huffmanTree,
    });

    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }
    await Promise.all([conversation.save(), newMessage.save()]);
    const receiverSocketId = getReciverSoketId(receiver);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", {
        sender,
        encodedContent,
        tree: JSON.stringify(huffmanTree),
      });
    }
    res.status(201).json({
      message: "message sent successfully",
      newMessage,
      tree: JSON.stringify(huffmanTree),
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getMessage = async (req, res) => {
  try {
    const receiver = req.params.id;
    const sender = req.user.id;
    let conversation = await CONVERSATION.findOne({
      participants: { $all: [sender, receiver] },
    }).populate("messages");

    if (!conversation) {
      return res.status(201).json([]);
    }

    let recivUser = await USER.findById(receiver);
    res.status(201).json({
      messages: conversation.messages,
      details: {
        name: recivUser.name,
        email: recivUser.email,
      },
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
