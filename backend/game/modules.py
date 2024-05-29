import random
from .models import GameResult

X = 0
Y = 1
Z = 2
NONE = 0
RED = 1
BLUE = 2
LEFT = 3
RIGHT = 4
TOP = 5
BOT = 6


class Ball:
    def __init__(self, speed):
        self.x = 0
        self.y = random.random() * 8 - 4
        self.z = random.random() * 12 - 6
        self.dir = [random.choice([1, -1]) * 0.1, random.choice([1, -1]) * 0.1, random.choice([1, -1]) * 0.1]
        self.speed = [1.2 * speed, 1.2 * speed, 1.2 * speed]
        self.hit = NONE
        self.hit_status = 0

    def move(self):
        self.x += self.dir[X] * self.speed[X]
        self.y += self.dir[Y] * self.speed[Y]
        self.z += self.dir[Z] * self.speed[Z]
        if self.hit < 10:
            self.hit_status += 1
        else:
            self.hit_status = 0
            self.hit = NONE

    def restart(self, speed):
        self.x = 0
        self.y = random.random() * 8 - 4
        self.z = random.random() * 12 - 6
        self.dir = [random.choice([1, -1]) * 0.1, random.choice([1, -1]) * 0.1, random.choice([1, -1]) * 0.1]
        self.speed = [1.2 * speed, 1.2 * speed, 1.2 * speed]
        self.hit = NONE

    def hit_wall(self):
        if -8 < self.z < -7:
            self.hit = LEFT
            self.dir[Z] *= -1
        if 8 < self.z < 7:
            self.hit = RIGHT
            self.dir[Z] *= -1
        if 4.5 < self.y < 5.5:
            self.hit = TOP
            self.dir[Y] *= -1
        if -4.5 > self.y > -5.5:
            self.hit = BOT
            self.dir[Y] *= -1

    def hit_paddle(self):
        if 23.5 < self.x < 24.5:
            return RED
        if -23.5 < self.x < -24.5:
            return BLUE
        return 0

    def check_hit_paddle(self, paddle, type):
        hit_bottom_y = paddle.y + 1.5 > self.y - 1 > paddle.y - 1.5
        hit_top_y = paddle.y + 1.5 > self.y + 1 > paddle.y - 1.5
        hit_bottom_z = paddle.z + 1.5 > self.z - 1 > paddle.z - 1.5
        hit_top_z = paddle.z + 1.5 > self.z + 1 > paddle.z - 1.5
        if hit_bottom_y or hit_top_y:
            if hit_bottom_z or hit_top_z:
                if type == RED:
                    self.hit = RED
                if type == BLUE:
                    self.hit = BLUE
                return 1
        return 0


class Player:
    def __init__(self, type, nick):
        self.y = 0
        self.z = 0
        self.type = type #Red, Blue
        self.nick = nick
        self.score = 0

    def set_pos(self, y, z):
        self.y = y
        self.z = z

    def add_score(self):
        self.score += 1
        if self.score == 10:
            return 1
        return 0


class Game:
    def __init__(self, speed, nick1, nick2, time):
        self.p1 = Player(RED, nick1)
        self.p2 = Player(BLUE, nick2)
        self.ball = Ball(speed)
        self.winner = None
        self.start_time = time

    def data(self):
        return {
            'redY': self.p1.y,
            'redZ': self.p1.z,
            'redScore': self.p1.score,
            'blueY': self.p2.y,
            'blueZ': self.p2.z,
            'blueScore': self.p2.score,
            'ballX': self.ball.x,
            'ballY': self.ball.y,
            'ballZ': self.ball.z,
            'ballHit': self.ball.hit,
        }

    def result(self):
        GameResult.objects.create(winner=self.winner,
                                  player1=self.p1,
                                  player2=self.p2,
                                  player_score=self.p1.score,
                                  player2_score=self.p2.score,
                                  start_time=self.start_time)
        return {
            'winner': self.winner,
            'redScore': self.p1.score,
            'blueScore': self.p2.score,
        }