// Jest can't run native Lottie animations, so tests use a plain View instead.
const React = require('react');
const { View } = require('react-native');
module.exports = props => React.createElement(View, { testID: 'lottie', style: props.style });
