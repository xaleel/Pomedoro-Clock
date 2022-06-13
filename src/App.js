import React from "react";
import "./App.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      breakLength: [5, 0],
      sessionLength: [25, 0],
      session: [25, 0],
      play: false,
      timeFactor: 60,
      active: "Session",
      beep: new Audio(
        "https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
      )
    };
    this.changeTiming = this.changeTiming.bind(this);
    this.reset = this.reset.bind(this);
    this.playPause = this.playPause.bind(this);
    this.switch = this.switch.bind(this);
  }

  changeTiming = (value) => {
    if (this.state.play) {
      return;
    }
    let brMins = this.state.breakLength[0];
    let brSecs = this.state.breakLength[1];
    let sesMins = this.state.sessionLength[0];
    let sesSecs = this.state.sessionLength[1];
    let f = this.state.timeFactor;
    switch (value) {
      case "br-inc":
        if ((brMins >= 59 && (brSecs + f) / 60 > 1) || brMins === 60) {
          return;
        }
        this.setState({
          breakLength:
            brSecs + f > 59
              ? [brMins + 1, brSecs + f - 60]
              : [brMins, brSecs + f]
        });
        break;
      case "br-dec":
        if (brMins === 1 && brSecs - f < 0) {
          return;
        }
        this.setState({
          breakLength:
            brSecs - f < 0
              ? [brMins - 1, 60 - (f - brSecs)]
              : [brMins, brSecs - f]
        });
        break;
      case "s-inc":
        if ((sesMins >= 59 && (sesSecs + f) / 60 > 1) || sesMins === 60) {
          return;
        }
        this.setState({
          sessionLength:
            sesSecs + f > 59
              ? [sesMins + 1, sesSecs + f - 60]
              : [sesMins, sesSecs + f],
          session:
            sesSecs + f > 59
              ? [sesMins + 1, sesSecs + f - 60]
              : [sesMins, sesSecs + f]
        });
        break;
      case "s-dec":
        if (sesMins === 1 && sesSecs - f < 0) {
          return;
        }
        this.setState({
          sessionLength:
            sesSecs - f < 0
              ? [sesMins - 1, 60 - (f - sesSecs)]
              : [sesMins, sesSecs - f],
          session:
            sesSecs - f < 0
              ? [sesMins - 1, 60 - (f - sesSecs)]
              : [sesMins, sesSecs - f]
        });
        break;
      default:
        break;
    }
  };

  changeFactor = (value, id) => {
    this.setState({
      timeFactor: value
    });
    document
      .querySelectorAll(".timeFactor")
      .forEach((e) => (e.className = "timeFactor"));
    document.querySelector(`#${id}`).className = "timeFactor active";
  };

  reset = () => {
    if (this.state.play) {
      return;
    }
    this.setState({
      breakLength: [5, 0],
      sessionLength: [25, 0],
      session: [25, 0],
      timeFactor: 1,
      active: "Session",
      interval: ""
    });
  };

  playPause = () => {
    if (this.state.play) {
      clearInterval(this.state.interval);
      this.setState({
        interval: "",
        play: false
      });
      document.querySelector("#play").classList.remove("invis");
      document.querySelector("#stop").classList.add("invis");
      return;
    } else {
      document.querySelector("#play").classList.add("invis");
      document.querySelector("#stop").classList.remove("invis");
      this.setState({
        play: true,
        interval: setInterval(() => {
          if (this.state.session[0] === 0 && this.state.session[1] === 0) {
            this.switch();
            this.state.beep.play();
          }
          this.setState({
            session:
              this.state.session[1] - 1 < 0
                ? [this.state.session[0] - 1, 60 - (1 - this.state.session[1])]
                : [this.state.session[0], this.state.session[1] - 1]
          });
        }, 1000)
      });
    }
  };

  switch = () => {
    this.setState({
      active: this.state.active === "Session" ? "Break" : "Session",
      session:
        this.state.active !== "Session"
          ? this.state.sessionLength
          : this.state.breakLength
    });
  };

  render() {
    let brkM =
      this.state.breakLength[0] <= 9
        ? "0" + this.state.breakLength[0]
        : this.state.breakLength[0];
    let brkS =
      this.state.breakLength[1] <= 9
        ? "0" + this.state.breakLength[1]
        : this.state.breakLength[1];
    let sesLM =
      this.state.sessionLength[0] <= 9
        ? "0" + this.state.sessionLength[0]
        : this.state.sessionLength[0];
    let sesLS =
      this.state.sessionLength[1] <= 9
        ? "0" + this.state.sessionLength[1]
        : this.state.sessionLength[1];
    let sesM =
      this.state.session[0] <= 9
        ? "0" + this.state.session[0]
        : this.state.session[0];
    let sesS =
      this.state.session[1] <= 9
        ? "0" + this.state.session[1]
        : this.state.session[1];
    return (
      <div className="App">
        <div id="title">
          <h1>25 + 5 Clock</h1>
        </div>

        <div className="section">
          <div className="length" id="break-label">
            <h2>Break Length</h2>
            <div className="controller">
              <button
                className="empty"
                id="break-increment"
                onClick={(e) => {
                  this.changeTiming("br-inc");
                }}
              >
                <i className="fa-solid fa-arrow-up"></i>
              </button>
              <h2 id="break-length">{brkM + ":" + brkS}</h2>
              <button
                className="empty"
                id="break-decrement"
                onClick={(e) => {
                  this.changeTiming("br-dec");
                }}
              >
                <i className="fa-solid fa-arrow-down"></i>
              </button>
            </div>
          </div>
          <div className="length" id="session-label">
            <h2>session Length</h2>
            <div className="controller">
              <button
                className="empty"
                id="session-increment"
                onClick={(e) => {
                  this.changeTiming("s-inc");
                }}
              >
                <i className="fa-solid fa-arrow-up"></i>
              </button>
              <h2 id="session-length">{sesLM + ":" + sesLS}</h2>
              <button
                className="empty"
                id="session-decrement"
                onClick={(e) => {
                  this.changeTiming("s-dec");
                }}
              >
                <i className="fa-solid fa-arrow-down"></i>
              </button>
            </div>
          </div>
        </div>
        <div className="controller up">
          <h4>Change by:</h4>
          <button
            id="min"
            className="timeFactor active"
            onClick={() => {
              this.changeFactor(60, "min");
            }}
          >
            1 min
          </button>
          <button
            id="thSec"
            className="timeFactor"
            onClick={() => {
              this.changeFactor(30, "thSec");
            }}
          >
            30 sec
          </button>
          <button
            id="tSec"
            className="timeFactor"
            onClick={() => {
              this.changeFactor(10, "tSec");
            }}
          >
            10 sec
          </button>
          <button
            id="oSec"
            className="timeFactor"
            onClick={() => {
              this.changeFactor(1, "oSec");
            }}
          >
            1 sec
          </button>
        </div>
        <div id="timer-label">
          <h2>{this.state.active}</h2>
          <h1 id="time-left">{sesM + ":" + sesS}</h1>
        </div>
        <div className="section">
          <button className="empty" id="start_stop" onClick={this.playPause}>
            <i id="play" className="fa-solid fa-play"></i>
            <i id="stop" className="fa-solid fa-pause invis"></i>
          </button>
          <button id="reset" className="empty" onClick={this.reset}>
            <i className="fa-solid fa-arrows-rotate"></i>
          </button>
        </div>
        <audio id="beep"></audio>
        <div className='footer'>
              <p>
                {'Made by '}
                <a href='https://xaleel.github.io/' target="_blank" rel="noopener noreferrer">Khaleel</a>
                {' @ 2022. '}
                <a href='https://github.com/xaleel/Pomodoro-Clock/' target="_blank" rel="noopener noreferrer">Source code</a>.
              </p>
          </div>
      </div>
    );
  }
}

export default App;
