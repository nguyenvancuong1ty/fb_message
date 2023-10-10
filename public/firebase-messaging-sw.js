// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
    apiKey: 'AIzaSyDcuDIddVQKAQoj0yMLrWsDTQDDAaAFY00',
    authDomain: 'fir-44abd.firebaseapp.com',
    databaseURL: 'https://fir-44abd-default-rtdb.firebaseio.com',
    projectId: 'fir-44abd',
    storageBucket: 'fir-44abd.appspot.com',
    messagingSenderId: '513391440326',
    appId: '1:513391440326:web:1c076486af50e8572742c7',
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();
messaging.onBackgroundMessage((payload) => {
    const notification = payload.data;
    const notificationOptions = {
        ...notification,
        icon: '/logo@.jpg',
    };

    self.registration.showNotification(notification.title, notificationOptions);
});
