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
        self.dir = [
            random.choice([1, -1]) * 0.1,
            random.choice([1, -1]) * 0.1,
            random.choice([1, -1]) * 0.1,
        ]
        self.speed = [1.2 * speed, 1.2 * speed, 1.2 * speed]
        self.hit = NONE
        self.hit_status = 0

    def move(self) -> None:
        self.x += self.dir[X] * self.speed[X]
        self.y += self.dir[Y] * self.speed[Y]
        self.z += self.dir[Z] * self.speed[Z]
        if self.hit < 10:
            self.hit_status += 1
        else:
            self.hit_status = 0
            self.hit = NONE

    def restart(self, speed) -> None:
        self.x = 0
        self.y = random.random() * 8 - 4
        self.z = random.random() * 12 - 6
        self.dir = [
            random.choice([1, -1]) * 0.1,
            random.choice([1, -1]) * 0.1,
            random.choice([1, -1]) * 0.1,
        ]
        self.speed = [1.2 * speed, 1.2 * speed, 1.2 * speed]
        self.hit = NONE

    def hit_wall(self) -> None:
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

    def hit_paddle(self) -> int:
        if 23.5 < self.x < 24.5:
            return RED
        if -23.5 < self.x < -24.5:
            return BLUE
        return 0

    def check_hit_paddle(self, paddle, type) -> int:
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
        self.type = type  # red, blue
        self.nick = nick
        self.status = "none"
        self.score = 0

    def set_pos(self, y, z) -> None:
        self.y = y
        self.z = z

    def add_score(self) -> int:
        self.score += 1
        if self.score == 10:
            return 1
        return 0


class Game:
    def __init__(self):
        self.p1 = None
        self.p2 = None
        self.speed = 0
        self.ball = Ball(speed=0)
        self.winner = None
        self.start_time = None

    def set_ready(self, color) -> int:
        if color == "red" and self.p1.status == "none":
            self.p1.status = "ready"
        elif color == "blue" and self.p2.status == "none":
            self.p2.status = "ready"
        if self.p1.status == "ready" and self.p2.status == "ready":
            return 1
        return 0

    def start_data(self, color, game) -> dict:
        return {
            "type": "start",
            "color": color,
            "map": game.game_map,
            "ball_color": game.ball_color,
            "ball": {
                "x": self.ball.x,
                "y": self.ball.y,
                "z": self.ball.z,
            },
            "redY": 0,
            "redZ": 0,
            "blueY": 0,
            "blueZ": 0,
        }

    def game_data(self) -> dict:
        return {
            "type": "move",
            "redY": self.p1.y,
            "redZ": self.p1.z,
            "redScore": self.p1.score,
            "blueY": self.p2.y,
            "blueZ": self.p2.z,
            "blueScore": self.p2.score,
            "ballX": self.ball.x,
            "ballY": self.ball.y,
            "ballZ": self.ball.z,
            "ballHit": self.ball.hit,
        }

    def result_data(self) -> dict:
        GameResult.objects.create(
            winner=self.winner,
            player1=self.p1,
            player2=self.p2,
            player_score=self.p1.score,
            player2_score=self.p2.score,
            start_time=self.start_time,
        )
        return {
            "type": "result",
            "winner": self.winner,
            "redScore": self.p1.score,
            "blueScore": self.p2.score,
        }
