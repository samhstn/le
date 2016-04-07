arr.slice(0,5).map((word) => {
  word.index = arr.indexOf(word)
  var leftNode = document.createElement('li');
  leftNode.classList.add('left');
  leftNode.innerHTML = word.left;
  leftNode.onclick = function(){show(word);}
  document.getElementsByClassName('leftInput')[0].appendChild(leftNode);
  var rightNode = document.createElement('li');
  rightNode.classList.add('right');
  rightNode.classList.add(''+word.index);
  rightNode.innerHTML = word.right;
  rightNode.style.visibility = 'hidden';
  document.getElementsByClassName('rightInput')[0].appendChild(rightNode);
});

function show(word) {
  var target = document.getElementsByClassName(''+word.index)[0];
  target.style.visibility = target.style.visibility === 'hidden' ? 'visible' : 'hidden';
}
