WIDGETS["alarm"]={area:"tl",width:0,draw:function() {
  if (this.width) g.reset().drawImage(atob("GBgBAAAAAAAAABgADhhwDDwwGP8YGf+YMf+MM//MM//MA//AA//AA//AA//AA//AA//AB//gD//wD//wAAAAADwAABgAAAAAAAAA"),this.x,this.y);
},reload:function() {
  WIDGETS["alarm"].width = (require('Storage').readJSON('alarm.json',1)||[]).some(alarm=>alarm.on) ? 24 : 0;
}
};
WIDGETS["alarm"].reload();
