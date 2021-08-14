import http from 'k6/http';
//import { sleep } from 'k6';

export let options = {
  scenarios: {
    constant_request_rate: {
      executor: 'constant-arrival-rate',
      rate: 10,
      timeUnit: '1s',
      duration: '30s',
      preAllocatedVUs: 1000,
      maxVUs: 5000,
    },
  },
};

export default function () {
    let id = Math.floor(Math.random() * (10000000 - 9000000 + 1) + 9000000)
    http.get(http.url`http://ec2-18-119-118-13.us-east-2.compute.amazonaws.com/books/${id}/reviews`);
}

