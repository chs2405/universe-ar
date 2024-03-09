AFRAME.registerComponent("foo", {
  init: function () {
    // This will be called after the entity has properly attached and loaded.
    gsap.to(".loading-page", { y: "-100%" });
  },
});
var tl = new TimelineMax({
  repeat: -1,
});

tl.staggerFromTo(".loading-dot", 0.5, { x: 0 }, { x: 60 }, -0.15);
gsap.from("#showText", { opacity: 0 }, +3);
window.addEventListener("load", () => {
  var stageIndex = 0; //current stage
  var numberOfStages; //remaining stage
  var stageAnswer = 1;
  var remainingDigits = 1;
  var check;
  const fetchData = async () => {
    try {
      const response = await fetch("data.json");
      const data = await response.json();
      const stages = data.stages;
      numberOfStages = stages.length;
      const stage = stages[stageIndex];
      const stageName = stage.name;
      const planets = stage.planets;
      const answer = stage.answer;
      stageAnswer = answer;
      if (stageIndex == 1 || stageIndex == 4) {
        remainingDigits = parseInt("1" + answer.toString().substring(3));
      } else {
        remainingDigits = parseInt("1" + answer.toString().substring(2));
      }
      console.log(remainingDigits);
      document.getElementById("finalD").innerHTML = answer;
      document.getElementById("stage").innerHTML = stageName;

      const planet1 = planets[0][0];
      const planet2 = planets[0][1];
      const planet1c = planets[1][0];
      const planet2c = planets[1][1];

      var planet1name = document.getElementsByClassName("p-box1");
      var planet2name = document.getElementsByClassName("p-box2");
      for (var i = planet1name.length - 1; i >= 0; i--) {
        planet1name[i].innerHTML = planet1c;
      }
      for (var i = planet2name.length - 1; i >= 0; i--) {
        planet2name[i].innerHTML = planet2c;
      }
      document.getElementById("planet1-model").removeAttribute("gltf-model");
      document
        .getElementById("planet1-model")
        .setAttribute("gltf-model", "#" + planet1 + "-asset");
      document.getElementById("planet2-model").removeAttribute("gltf-model");
      document
        .getElementById("planet2-model")
        .setAttribute("gltf-model", "#" + planet2 + "-asset");
      if (stageIndex == 3) {
        document
          .getElementById("planet2-model")
          .setAttribute("scale", { x: 0.3, y: 0.3, z: 0.3 });
        document
          .getElementById("planet1-model")
          .setAttribute("scale", { x: 0.1, y: 0, z: 0.1 });
      } else {
        document.getElementById("planet2-model").removeAttribute("scale");
        document.getElementById("planet1-model").removeAttribute("scale");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const marker = document.querySelectorAll("a-marker");
  const marker1 = marker[0];
  const marker2 = marker[1];

  marker1.addEventListener("markerFound", () => {
    check = setInterval(() => {
      let marker1Position = marker1.object3D.position;
      let marker2Position = marker2.object3D.position;
      var distance =
        marker1Position.distanceTo(marker2Position).toFixed(1) * 10;
      finaldistance = distance * remainingDigits;
      console.log(distance);
      document.getElementById("distance").innerHTML = finaldistance;
      if (Math.abs(finaldistance - stageAnswer) <= 0.1) {
        gsap.to(".block", { y: 0 });
      }
    }, 100);
  });

  marker1.addEventListener("markerLost", () => {
    clearInterval(check);
    distance = 0;
    document.getElementById("distance").innerHTML = 0;
  });
  marker2.addEventListener("markerLost", () => {
    clearInterval(check);
    distance = 0;
    document.getElementById("distance").innerHTML = 0;
  });

  const nextButton = document.querySelector(".next-button");
  nextButton.addEventListener("click", async () => {
    stageIndex++;
    gsap.to(".block", { y: "-100%" });
    if (stageIndex === numberOfStages) {
      document.location = "finish.html";
    } else {
      await fetchData();
    }
  });

  fetchData();
});
