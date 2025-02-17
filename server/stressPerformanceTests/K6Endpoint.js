import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    stages: [
        { duration: '1m', target: 50 },
        { duration: '1m', target: 100 },
        { duration: '1m', target: 150 },
        { duration: '1m', target: 10 },
    ],
};

const baseURL = `http://192.168.1.6:8080` //Ændre til egen IP!

export function setup() {
    
}

export default function () {
    const uniqueEmail = `test_${__VU}_${Date.now()}@example.com`;
    const testUser = {
        email: uniqueEmail,
        password: 'password123',
        name: 'Test User',
    };
    // POST /API/users
    const postResponse = http.post(`${baseURL}/API/users`, JSON.stringify(testUser), {
        headers: { 'Content-Type': 'application/json' },
    });
    check(postResponse, {
        'POST /API/users - Status 200': (res) => res.status === 200,
    });
    sleep(2);
    // GET /API/users
    const getUsersResponse = http.get(`${baseURL}/API/users`);
    check(getUsersResponse, {
        'GET /API/users - Status 200': (res) => res.status === 200,
    });
    // GET /API/users/email
    const getEmailResponse = http.get(`${baseURL}/API/users/email?email=${testUser.email}`);
    check(getEmailResponse, {
        'GET /API/users/email - Status 200': (res) => res.status === 200,
    });
    // POST /API/users/:id
    const postUpdateResponse = http.post(`${baseURL}/API/users/1`, JSON.stringify({
        email: 'updated@example.com',
        password: 'password123',
        name: 'Updated User',
    }), {
        headers: { 'Content-Type': 'application/json' },
    });
    check(postUpdateResponse, {
        'POST /API/users/1 - Status 200': (res) => res.status === 200,
    });
    // DELETE /API/users/delete
    const deleteUserResponse = http.del(`${baseURL}/API/users/delete`, JSON.stringify({ email: uniqueEmail }), {
        headers: { 'Content-Type': 'application/json' },
    });
    check(deleteUserResponse, {
        'DELETE /API/users/delete - Status 200': (res) => res.status === 200 || res.status === 404,
    });
    sleep(1);
}
