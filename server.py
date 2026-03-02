"""Simple WebSocket relay for chess game rooms.

Usage:
    pip install websockets
    python3 server.py

Clients connect and send JSON messages:
  {"type":"join","room":"ROOMID","name":"optional"}
  {"type":"move","move":"e2e4"}
The server relays moves to other clients in same room.
"""
import asyncio
import json
import websockets

rooms = {}  # room_id -> set of websockets

async def handler(ws, path):
    room = None
    try:
        async for msg in ws:
            try:
                data = json.loads(msg)
            except Exception:
                continue
            t = data.get("type")
            if t == "join":
                room = data.get("room")
                if room not in rooms:
                    rooms[room] = set()
                rooms[room].add(ws)
                await ws.send(json.dumps({"type":"joined","room":room}))
            elif t == "move" and room:
                # broadcast to others
                for peer in list(rooms.get(room, [])):
                    if peer is not ws:
                        try:
                            await peer.send(json.dumps({"type":"move","move":data.get("move")}))
                        except Exception:
                            pass
            elif t == "name" and room:
                # propagate name to others
                for peer in list(rooms.get(room, [])):
                    if peer is not ws:
                        try:
                            await peer.send(json.dumps({"type":"name","name":data.get("name")}))
                        except Exception:
                            pass
    finally:
        if room and ws in rooms.get(room, set()):
            rooms[room].remove(ws)
            if not rooms[room]:
                del rooms[room]

async def main():
    async with websockets.serve(handler, "0.0.0.0", 8765):
        print("Server running on ws://0.0.0.0:8765")
        await asyncio.Future()  # run forever

if __name__ == "__main__":
    asyncio.run(main())
