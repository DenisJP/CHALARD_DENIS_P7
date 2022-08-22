<template>
  <div id="app">
    <link href='http://fonts.googleapis.com/css?family=Lato:400,700' rel='stylesheet' type='text/css'>
    <!-- app title -->
    <h3 class="appTitle">GROUPOMANIA SNS</h3>
    <router-view/>
  </div>
</template>

<!-- global css -->
<style lang="scss">
html, body {
  padding: 0;
  margin: 0;
  background-color: #4E5166;
}
#app {
  font-family: Lato, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

/* app */
.appTitle {
  margin-top: 10px;
  color: #be5b47;
  font-weight: bold;
}

.appError {
  padding: 5px;
  font-size: 10px;
  color: #ec5b3d;
  font-weight: bold;
  text-transform: uppercase;
}

/* wrapper */
.smallWrapper {
  max-width: 240px;
}

.mediumWrapper {
  max-width: 600px;
}

/* block */
.blockTitle {
  font-size: 14px;
  font-weight: bold;
  color: #FFD7D7;
  text-transform: uppercase;
}

/* form */
.formPost {
  background-color: #383a4b;
  margin-top: 10px;
  padding: 10px;
  border: #222b35 solid 2px;
  border-radius: 10px;
  margin-left: auto;
  margin-right: auto;
}

.formPost input {
  width: 100%;
  padding: 5px;
  border: #222b35 solid 2px;
  border-radius: 4px;
  background-color: #FFF;
  margin-top: 10px;
}

.formPost button {
  margin-top: 10px;
  width: 100%;
  padding: 5px;
  border: #222b35 solid 1px;
  border-radius: 4px;
  color: #fff;
  background-color: #4E5166;
}
</style>
