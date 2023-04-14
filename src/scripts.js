import User from '../src/User'
import Hydration from '../src/Hydration'
import Sleep from '../src/Sleep'
import Activity from '../src/Activity'
import apiCalls from '../src/apiCalls'
import Countdown from 'countdown-js'


// global variables
let user, hydration, activity, sleep, toggle, end

// timer global variables
let pause = false
let reps = 0
let sets = 0
const thirtySeconds = 3000

// query selectors
const userAddress = document.querySelector('.user-address')
const userEmail = document.querySelector('.user-email')
const userStride = document.querySelector('.user-stride')
const userSteps = document.querySelector('.user-steps')
const welcomeMessage = document.querySelector('.welcome-message')
const comparisonSteps = document.querySelector('.comparison-steps')
const hydrationToday = document.querySelector('.hydration-today')
const dateMessage = document.querySelector('.date-message')
const stepsToday = document.querySelector('.activity-steps-today')
const distanceWalkedToday = document.querySelector('.activity-distance-today')
const activeMinutesToday = document.querySelector('.activity-total-today')
const goalReached = document.querySelector('.activity-goal')
const sleepToday = document.querySelector('.sleep-today')
const sleepQualityToday = document.querySelector('.sleep-quality-today')
const sleepAverage = document.querySelector('.sleep-average-allTime')
const sleepQualityAll = document.querySelector('.sleep-quality-allTime')
const profileImage = document.querySelector('.profile-image')
const expandedContainer = document.querySelector('.expanded-container')
const userGreeting = document.querySelector('.user-greeting')
const userInputDate = document.getElementById('new-date')
const userInputSteps = document.getElementById('new-steps')
const addActivityButton = document.querySelector('.log-activity-button')
const timerStartButton = document.querySelector('.start-button')
const timerResetButton = document.querySelector('.reset-button')
const timerMinutes = document.querySelector('.timer-minutes')
const timerSeconds = document.querySelector('.timer-seconds')
const repsCount = document.querySelector('.reps-count')
const setsCount = document.querySelector('.sets-count')
const activityChart = document.querySelector('.activity-chart')
const postVerification = document.querySelector('.post-verification')

// event listeners
profileImage.addEventListener("click", toggleExpanded)
welcomeMessage.addEventListener("click", toggleExpanded)
addActivityButton.addEventListener("click", addActivity)
timerStartButton.addEventListener("click", startTimer)
timerResetButton.addEventListener("click", resetTimer)
welcomeMessage.addEventListener("keydown", (event) => {
  if (event.key === 'Enter') {
    userGreeting.innerText =  `Welcome back, ${user.name.split(" ")[0]}!`
    userAddress.innerText = `${user.address}`
    userEmail.innerText = `${user.email}`
    userStride.innerText = `Stride Length: ${user.strideLength} ft`
    expandedContainer.style.display = "inline";
  }
})

profileImage.addEventListener("keydown", (event) => {
    if (event.key === 'Enter') {
      userGreeting.innerText =  `Welcome back, ${user.name.split(" ")[0]}!`
      userAddress.innerText = `${user.address}`
      userEmail.innerText = `${user.email}`
      userStride.innerText = `Stride Length: ${user.strideLength} ft`
      expandedContainer.style.display = "inline";
    }
})

window.addEventListener('load', () => {

// functions 
Promise.all(apiCalls)
  .then((apiCallsArray) => {
    const usersData = apiCallsArray[0].users
    const sleepData = apiCallsArray[1].sleepData
    const hydrationData = apiCallsArray[2].hydrationData
    const activityData = apiCallsArray[3].activityData
    displayRandomUser(usersData)
    displayHydration(hydrationData, usersData)
    displayActivity(activityData, usersData)
    displayDate()
    displaySleepActivity(sleepData)
    displayActivityTracker()
    displayHydrationTracker()
    displaySleepTracker()
  })
  .catch(error => console.log(error))
})

function addActivity(event) {
  event.preventDefault()
  if (!userInputDate.value || !userInputSteps.value) {
    window.alert('Please select a date and fill in the number of steps')
    
  } else {
    fetch('http://localhost:3001/api/v1/activity', {
      method: 'POST',
      body: JSON.stringify({userID: parseInt(`${user.id}`), date: `${userInputDate.value}`, flightsOfStairs: 0, minutesActive: 0, numSteps: `${userInputSteps.value}`}),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(postVerification.innerText = `You logged ${userInputSteps.value} steps on ${userInputDate.value}. Great Job!`)
      .then(postVerification.style.visibility = "visible")
      .then(response => response.json())
      .then(json => console.log(json))
      .catch(Error => window.alert('Server Error...Try Again later!'), Error);
      userInputDate.value = ''
      userInputSteps.value = ''
    }
}

function getRandomIndex(usersData) {
  return Math.floor(Math.random() * usersData.length)
}

function displayDate() {
  let date = new Date().toLocaleDateString('en-us', { weekday: "long", year: "numeric", month: "short", day: "numeric" })
  dateMessage.innerText = `${date}`
}

function htmlDateHelper() {
  var date = new Date()
  var month = ('0' + (date.getMonth() + 1)).slice(-2)
  var day   = ('0' + date.getDate()).slice(-2)
  var year  = date.getFullYear()
  var htmlDate = year + '/' + month + '/' + day
  return htmlDate;
}

function displayRandomUser(usersData) {
  user = new User(usersData[getRandomIndex(usersData)])
  userSteps.innerText = `Your goal is to take ${user.dailyStepGoal} steps today.`
  welcomeMessage.innerText = `${user.name}`
  comparisonSteps.innerText = `The average FitLit user has a goal of ${user.usersAvgDailyStep(usersData)} steps today.`
}

function displayActivity(activityData) {
  activity = new Activity(activityData)
  var htmlDate = htmlDateHelper()
  stepsToday.innerText = `Steps Taken: ${activity.todaysStepCount(user, htmlDate )}`
  distanceWalkedToday.innerText = `Distance Walked: ${activity.milesWalkedByDay(user, htmlDate)} miles`
  activeMinutesToday.innerText = `Minutes Active: ${activity.minutesActiveByDay(user, htmlDate)} minutes`
  goalReached.innerText = `Goal Reached?: ${activity.reachStepGoal(user, htmlDate)}`
}

function displayHydration(hydrationData) {
  hydration = new Hydration(hydrationData)
  hydrationToday.innerText = `You'ved logged ${hydration.findDailyFluidIntake(user.id, hydration.findUserData(user.id)[0].date)} oz of water today.`
}

function displaySleepActivity(sleepData) {
  sleep = new Sleep(sleepData)
  var htmlDate = htmlDateHelper()
  sleepToday.innerText = `Last Rest: ${sleep.findDailyHours(user, htmlDate)} hours`
  sleepAverage.innerText = `Average Rest: ${sleep.findAvgHours(user)} hours `
  sleepQualityToday.innerText = `Last Rest Quality: ${sleep.findDailyQuality(user, htmlDate)}`
  sleepQualityAll.innerText = `Average Rest Quality: ${sleep.findAvgQuality(user)}`
}

function displayActivityTracker() {
  const ctx = document.querySelector('.activity-chart')
  var htmlDate = htmlDateHelper()
  var weekHoursArray = activity.weeklyStepCount(user, htmlDate)
  var dateKeys = Object.keys(weekHoursArray).reverse()
  var shortenedKeys = []
  dateKeys.forEach((key)  =>  {
    shortenedKeys.push(key.slice(5))
    return shortenedKeys
  })

Chart.defaults.color = "#EDEDED",
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: shortenedKeys,
      datasets:[{
        label: "Steps taken",
        data: activity.chartWeeklySteps(user, htmlDate),
        backgroundColor: ["#CAFCFF", "#89EBF1", "#65CAF6", "#28B0EB", "#2882EB", "#095AB8", "#023572"],
      }]
    },
    options: {
      plugins: {
          legend: {
              display: false
          },
      },
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          ticks: {
            autoSkip: false,
            maxRotation: 0,
            minRotation: 0
          }
        },
        y: {
          ticks: {
            autoSkip: false,
            maxRotation: 0,
            minRotation: 0
          }
        }
      }
  }
  });
}

function displaySleepTracker() {
  const ctx = document.querySelector('.sleep-chart')
  var htmlDate = htmlDateHelper()
  var weekHoursArray = sleep.findWeeklyHours(user, htmlDate)
  var dateKeys = Object.keys(weekHoursArray).reverse()
  var shortenedKeys = []
  dateKeys.forEach((key)  =>  {
    shortenedKeys.push(key.slice(5))
    return  shortenedKeys
  })
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: shortenedKeys,
      color: "#fefefe",
      datasets: [{
        color: "#fefefe",
        label: 'Quality of sleep',
        data: sleep.chartWeeklyQuality(user, htmlDate),
        backgroundColor: "#828282",
        borderWidth: 0,
      },
      {
        label: "Hours slept",
        data: sleep.chartWeeklyHours(user, htmlDate),
        backgroundColor: ["#CAFCFF", "#89EBF1", "#65CAF6", "#28B0EB", "#2882EB", "#095AB8", "#023572"],
        stack: 'combined',
        type: 'bar',
      },],
    },
    options: {
      plugins: {
          legend: {
              display: false,
              labels:  {
                color: "white",
              },
          },
      },
      responsive: true,
      maintainAspectRatio: false,
    },
    scales: {
      x: {
        ticks: {
          color: "white"
        }
      },
      y: {
        stacked: true,
        ticks: {
          color: "white"
        }
      }
    }
});
}

function displayHydrationTracker() {
  const ctx = document.querySelector('.hydration-chart')
  var htmlDate = htmlDateHelper()
  var weekHoursArray = hydration.calculateFluidWeekly(user, htmlDate)
  var dateKeys = Object.keys(weekHoursArray).reverse()
  var shortenedKeys = []
  dateKeys.forEach((key)  =>  {
    shortenedKeys.push(key.slice(5))
    return shortenedKeys
  })
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: shortenedKeys,
      datasets: [{
        label: "Ounces drank",
        data: hydration.chartWeeklyFluids(user, htmlDate),
        color: "#EDEDED",
        backgroundColor: ["#CAFCFF", "#89EBF1", "#65CAF6", "#28B0EB", "#2882EB", "#095AB8", "#023572"],
        borderWidth: 0,
      }]
    },
    options: {
      plugins: {
          legend: {
              display: false
          },
      },
      responsive: true,
      maintainAspectRatio: false,
  }
  });
}

function toggleExpanded() {
  if (toggle === true)  {
    toggle = false
    userGreeting.innerText =  `Welcome back, ${user.name.split(" ")[0]}!`
    userAddress.innerText = `${user.address}`
    userEmail.innerText = `${user.email}`
    userStride.innerText = `Stride Length: ${user.strideLength} ft`
    expandedContainer.style.display = "inline"
  } else {
    toggle = true;
    expandedContainer.style.display = "none"
  }
  return toggle
}

function startTimer() {
  pause = false;
  end = new Date(new Date().getTime() + thirtySeconds)
  let timer = Countdown.timer(end, function(timeLeft) {
    if (pause === false)  {
      timerMinutes.innerText = `0${timeLeft.minutes}:`
      timerSeconds.innerText = timeLeft.seconds
    } else {
      pause = true
    }
  }, function() {
    timerMinutes.innerText = "00:"
    timerSeconds.innerText = "00"
    if (pause === false)  {
      reps = (reps +1)
      repsCount.innerText = (`${reps} Reps`)
      if (reps === 3)  {
        sets = (sets +1)
        setsCount.innerText = (`${sets} Sets`)
        setTimeout(() => {
          reps = 0
          repsCount.innerText = (`${reps} Reps`)
        }, 250);
      } 
    }
  })
}

function resetTimer() {
  reps = 0;
  repsCount.innerText = (`${reps} Reps`)
  sets = 0;
  setsCount.innerText = (`${sets} Sets`)
  console.log("timeout");
}



// imports
import './css/styles.css';
import './images/logo-image.png';
import './images/profile-image.png';
import './images/background.png';
import './images/background-flip.png';
import './images/spacer-gif.gif';
import './images/friend1-image.png';
import './images/friend2-image.png';
import './images/friend3-image.png';
import './images/friend4-image.png';
import './images/friend5-image.png';
import './images/timer-placeholder.jpg';






