import random
from django.apps import apps

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
START = 7

WAIT = 0
READY = 1
END = 2
DISCONNECTED = 3


class Ball:
    def __init__(self, speed: float) -> None:
        self.x = 0.0
        self.y = random.random() * 8 - 4
        self.z = random.random() * 12 - 6
        self.dir = [
            random.choice([1, -1]) * 0.1,
            random.choice([1, -1]) * 0.1,
            random.choice([1, -1]) * 0.1,
        ]
        self.speed = [speed, speed, speed]
        self.hit = NONE
        self.hit_status = 0

    def move(self) -> None:
        # 시작 직전에는 5프레임 멈춤
        if not self.hit == START:
            self.x += self.dir[X] * self.speed[X]
            self.y += self.dir[Y] * self.speed[Y]
            self.z += self.dir[Z] * self.speed[Z]
        if self.hit_status < 10 and self.hit != NONE:
            self.hit_status += 1
        else:
            self.hit_status = 0
            self.hit = NONE

    def restart(self, speed: float) -> None:
        self.x = 0
        self.y = random.random() * 8 - 4
        self.z = random.random() * 12 - 6
        self.dir = [
            random.choice([1, -1]) * 0.1,
            random.choice([1, -1]) * 0.1,
            random.choice([1, -1]) * 0.1,
        ]
        self.speed = [speed, speed, speed]
        self.hit = START
        self.hit_status = 0

    def hit_wall(self) -> None:
        if -8 < self.z < -7:
            self.hit = LEFT
            self.hit_status = 0
            self.dir[Z] *= -1
        if 8 > self.z > 7:
            self.hit = RIGHT
            self.hit_status = 0
            self.dir[Z] *= -1
        if 4.5 < self.y < 5.5:
            self.hit = TOP
            self.hit_status = 0
            self.dir[Y] *= -1
        if -4.5 > self.y > -5.5:
            self.hit = BOT
            self.hit_status = 0
            self.dir[Y] *= -1

    # local 보다 범위 넓게 잡음
    def check_ball_xpos(self) -> int:
        if 19.4 < self.x < 20.6:
            return RED
        if -19.4 > self.x > -20.6:
            return BLUE
        return 0

    def check_hit_paddle(self, paddle: "Player", type: int) -> int:
        if not type:
            return 0
        hit_bottom_y = paddle.y + 1.5 > self.y - 1 > paddle.y - 1.5
        hit_top_y = paddle.y + 1.5 > self.y + 1 > paddle.y - 1.5
        hit_bottom_z = paddle.z + 1.5 > self.z - 1 > paddle.z - 1.5
        hit_top_z = paddle.z + 1.5 > self.z + 1 > paddle.z - 1.5
        if hit_bottom_y or hit_top_y:
            if hit_bottom_z or hit_top_z:
                if type == RED:
                    self.hit = RED
                    self.hit_status = 5
                if type == BLUE:
                    self.hit = BLUE
                    self.hit_status = 5
                self.dir[X] *= -1
                return 0
        if type == RED:
            return BLUE
        return RED


class Player:
    def __init__(self, type: str, nick: str, id: str) -> None:
        self.y = 0.0
        self.z = 0.0
        self.type = type  # red, blue
        self.nick = nick
        self.id = id
        self.status = WAIT
        self.score = 0

    def set_pos(self, y: float, z: float) -> None:
        self.y = y
        self.z = z

    def set_status(self, status: int) -> None:
        self.status = status


class Game:
    def __init__(self, speed: float) -> None:
        self.p1 = None
        self.p2 = None
        self.speed = 1.0 + speed * 0.7
        self.ball = Ball(speed=1.0 + speed * 0.7)
        self.winner = None
        self.winner_id = None
        self.start_time = None

    def get_players(self) -> dict:
        return {
            "red": self.p1,
            "blue": self.p2,
        }

    def set_ready(self, player: "Player") -> int:
        if player.status == WAIT:
            player.status = READY
        if self.p1 and self.p2:
            if self.p1.status == READY and self.p2.status == READY:
                return 1
        return 0

    def get_winner(self) -> str:
        if self.winner != "None":
            return self.winner
        elif self.p1.status == DISCONNECTED and self.p2.status != DISCONNECTED:
            return self.p2.nick
        elif self.p1.status != DISCONNECTED and self.p2.status == DISCONNECTED:
            return self.p1.nick
        else:
            return "None"

    def check_game_end(self) -> int:
        if self.p1.status == DISCONNECTED or self.p1.status == END:
            if self.p2.status == DISCONNECTED or self.p2.status == END:
                return 1
        else:
            return 0

    def add_score(self, type: int) -> int:
        if type == 0:
            return 0
        if type == RED:
            self.p1.score += 1
        elif type == BLUE:
            self.p2.score += 1
        if self.p1.score >= 5 or self.p2.score >= 5:
            return type
        return 0

    def game_render(self) -> None:
        self.ball.move()  # 공을 1프레임 움직임
        self.ball.hit_wall()  # 벽에 닿았는 지 확인
        ball_pos = self.ball.check_ball_xpos()
        if ball_pos == RED:
            paddle = self.p1
        else:
            paddle = self.p2
        player_get_score = self.ball.check_hit_paddle(
            paddle, ball_pos
        )  # 공이 패들에 안 맞으면 점수 추가
        if player_get_score:
            winner = self.add_score(player_get_score)
            if not winner:  # 승자 결정이 안될 경우 재시작
                self.ball.restart(self.speed)
            # 승자 설정
            if winner == RED:
                self.winner = self.p1.nick
                self.winner_id = self.p1.id
            elif winner == BLUE:
                self.winner = self.p2.nick
                self.winner_id = self.p2.id

    def start_data(self, color: str, game: "GameResult") -> dict:
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
            "redNick": self.p1.nick,
            "redY": self.p1.y,
            "redZ": self.p1.z,
            "redScore": self.p1.score,
            "blueNick": self.p2.nick,
            "blueY": self.p2.y,
            "blueZ": self.p2.z,
            "blueScore": self.p2.score,
            "ballX": self.ball.x,
            "ballY": self.ball.y,
            "ballZ": self.ball.z,
            "ballHit": self.ball.hit,
        }

    def result_data(self, game_type) -> dict:
        return {
            "winner": self.winner,
            "redNick": self.p1.nick,
            "redScore": self.p1.score,
            "blueNick": self.p2.nick,
            "blueScore": self.p2.score,
            "gameType": game_type,
        }

    def tournament_result_data(
        self, is_final: bool, final_id: str, winner1: str, winner2: str
    ) -> dict:
        return {
            "isFinal": is_final,
            "finalId": final_id,
            "winner1": winner1,
            "winner2": winner2,
        }
