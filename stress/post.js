import http from 'k6/http';

export let options = {
  scenarios: {
    constant_request_rate: {
      executor: 'constant-arrival-rate',
      rate: 1000,
      timeUnit: '1s',
      duration: '30s',
      preAllocatedVUs: 1000,
      maxVUs: 5000,
    },
  },
};

export default function () {
  let data = {
    "review": "Eu amet ipsum adipisicing. Veniam eu sit consequat velit. Magna sunt ullamco labore nisi ut nisi id magna pariatur ut eu laborum do nostrud minim. Mollit mollit fugiat nostrud nulla adipisicing pariatur ut ex occaecat dolore adipisicing nisi ullamco. Dolor reprehenderit consectetur laborum mollit amet ipsum officia mollit eu ipsum eiusmod in consequat velit. Cupidatat et eu sit non.",
    "date": "2018-09-20T08:00:56.479-05:00",
    "overall_stars": 1,
    "performance_stars": 1,
    "story_stars": 1,
    "review_title": "quis excepteur",
    "found_helpful": 11,
    "source": "Audible",
    "location": "United States"
    };

  http.post(http.url`http://localhost:4001/benchmark/post`, data);
}
