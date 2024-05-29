import math
import random

X = 0
Y = 1
Z = 2

class Ball:
    def __init__(self, speed, radius):
        self.x = 0
        self.y = random.random() * 8 - 4
        self.z = random.random() * 12 - 6
        self.dir = [random.choice([1, -1]) * 0.1, random.choice([1, -1]) * 0.1, random.choice([1, -1]) * 0.1]
        self.speed = [1.2, 1.2, 1.2]
        self.radius = radius

    def move(self):
        self.x += self.dir[X] * self.speed[X]
        self.y += self.dir[Y] * self.speed[Y]
        self.z += self.dir[Z] * self.speed[Z]

    def restart(self):
        self.x = 0
        self.y = random.random() * 8 - 4
        self.z = random.random() * 12 - 6
        self.dir = [random.choice([1, -1]) * 0.1, random.choice([1, -1]) * 0.1, random.choice([1, -1]) * 0.1]
        self.speed = [1.2, 1.2, 1.2]

    def hit_wall(self):
        if -8 < self.z < -7 or 8 < self.z < 7:
            self.dir[Z] *= -1
        if 4.5 < self.y < 5.5 or -4.5 > self.y > -5.5:
            self.dir[Y] *= -1

    def hit_paddle(self):
        if 23.5 < self.x < 24.5 or -23.5 < self.x < -24.5:
            return 1
        return 0


    def check_hit_paddle(self, paddle):
        hit_bottom_y = paddle.y + 1.5 > self.y - 1 > paddle.y - 1.5
        hit_top_y =  paddle.y + 1.5 > self.y + 1 > paddle.y - 1.5
        hit_bottom_z =  paddle.z + 1.5 > self.z - 1 > paddle.z - 1.5
        hit_top_z =  paddle.z + 1.5 > self.z + 1 > paddle.z - 1.5
        if hit_bottom_y or hit_top_y:
            if hit_bottom_z or hit_top_z:
                return 1
        return 0

class Paddle:
    def __init__(self):
        self.y = 0
        self.z = 0

    def set(self, y, z):
        self.y = y
        self.z = z

class Player:
    def __init__(self):
        self.score = 0