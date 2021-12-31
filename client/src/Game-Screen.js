//Game Screen
import { useState, useEffect, useRef } from 'react';
import {io} from 'socket.io-client';
import './Game-Screen.css';

const ENDPOINT = 'http://10.0.0.30:9000';
const PLAYER_SIZE = 40;
const PROJECTILE_SIZE = 10;

//player obj
class Player {
	constructor(id, x, y) {
		this.id = id;
		this.x = x;
		this.y = y;
		this.w = PLAYER_SIZE;
		this.h = PLAYER_SIZE; 
		this.c = '#f00';
	}
	get_pos() {
		return [this.x, this.y];
	}
	set_pos(x,y) {
		this.x = x;
		this.y = y;
	}
	render = (ctx) => {
		//draw body
		ctx.beginPath();
		ctx.fillStyle = this.c;
		ctx.fillRect(this.x, this.y, this.w, this.h);
		//draw nametag
		ctx.fillStyle = '#000';
		ctx.font = '15px serif';
		ctx.textAlign = 'center';
		ctx.fillText(this.id, this.x+(this.w/2), this.y-5, 75);
	}
}
//projectile obj
class Projectile {
	constructor(id, p, v) {
		this.id = id;
		this.w = PROJECTILE_SIZE;
		this.h = PROJECTILE_SIZE;
		[this.x, this.y] = p;
		[this.vx,this.vy] = v;
	}
	move = () => {
		this.x += this.vx;
		this.y += this.vy;
	}
	render = (ctx) => {
		ctx.beginPath();
		ctx.fillStyle = '#000';
		ctx.fillRect(this.x, this.y, this.w, this.h);
	}
}
//screen dim obj
class Screen {
	constructor(w, h) {
		this.x = 0;
		this.y = 0;
		this.w = w;
		this.h = h;
	};
}

function Game_Screen(props) {
	const [sprites, set_sprites] = useState(new Map([[props.name, new Player(props.name, 0, 0)]]));
	const me = sprites.get(props.name);
	const projs = [];
	const [msgs, set_msgs] = useState(['','','']);
	const mcoords = [0,0];
	const canvasRef = useRef(null);
	let dirs = [false,false,false,false,false];
	let can_fire = true;
	let frameCount = 0;
	let socket = null;
	let screen = null;

	const handle_key_down = (e) => {
		switch(e.key) {
			case 'w':
				if (!dirs[0]) {dirs[0] = true;}
				break;
			case 'a':
				if (!dirs[1]) {dirs[1] = true;}
				break;
			case 's':
				if (!dirs[2]) {dirs[2] = true;}
				break;
			case 'd':
				if (!dirs[3]) {dirs[3] = true;}
				break;
			case ' ':
				if (!dirs[4]) {dirs[4] = true;}
				break;
			default:
				return;
		}
	}
	const handle_key_up = (e) => {
		switch(e.key) {
			case 'w':
				dirs[0] = false;
				break;
			case 'a':
				dirs[1] = false;
				break;
			case 's':
				dirs[2] = false;
				break;
			case 'd':
				dirs[3] = false;
				break;
			case ' ':
				dirs[4] = false;
				break;
			default:
				return;
		}
	}
	const get_mouse = (e) => {
		const rect = canvasRef.current.getBoundingClientRect();
		const x = Math.floor(e.clientX - rect.left);
    const y = Math.floor(e.clientY - rect.top);
		if (e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom) {
			mcoords[0] = x;
			mcoords[1] = y;
		}
	}
	const handle_shoot = () => {
		if (can_fire && dirs[4]) {
			const [x,y] = [mcoords[0] - me.x, mcoords[1] - me.y];	//vector pointing from player to cursor
			const normalizer = Math.sqrt(x**2 + y**2);						//make unit vector
			const vx = 5 * x / normalizer;												//scale so ||v|| == 5
			const vy = 5 * y / normalizer;
			projs.push(new Projectile(me.id,[me.x,me.y],[vx,vy]));
			can_fire = false;
		}
	}

	//called on initial mount of game screen
	useEffect(() => {
		//fix canvas resolution, save its dimensions
		screen = fix_res(canvasRef.current);

		//create connection to backend
		socket = io(ENDPOINT);
		socket.emit('joined', props.name);
		//grab all already connected players
		socket.on('welcome', (connected) => {
			for (const i of connected) {
				set_sprites(new Map(sprites.set(i.id, new Player(i.id, i.x, i.y))));
			}
		});
		//handle when someone else joins the game
		socket.on('joined', (id) => {
			set_sprites(new Map(sprites.set(id, new Player(id, 0, 0))));

			let m = msgs;
			m.shift();
			m.push(`${get_time()} ${id.substring(0,10)} joined the game`);
			set_msgs(m);
		});
		//handle when someone else moves
		socket.on('moved', (player) => {
			const s = sprites;
			s.get(player.id).set_pos(player.x, player.y);
			set_sprites(s);
		});
		//handle when someone leaves
		socket.on('left', (id) => {
			const s = sprites;
			s.delete(id);
			set_sprites(s);

			let m = msgs;
			m.shift();
			m.push(`${get_time()} ${id.substring(0,10)} left the game`);
			set_msgs(m);
		});

		//event listeners to grab when user taps a key
		document.addEventListener("keydown", handle_key_down);
		document.addEventListener("keyup", handle_key_up);
		document.addEventListener("mousemove", get_mouse);

		//cleanup
		return () => {
			document.removeEventListener("keydown", handle_key_down);
			document.removeEventListener("keyup", handle_key_up);
			document.removeEventListener("mousemove", get_mouse);
			socket.disconnect();
		};
	}, []);

	//draws cur instance of game screen
	const draw = (ctx) => {
		//clear screen and draw background
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		ctx.beginPath();
		ctx.fillStyle = '#fff';
		ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		//draw all players
		for (const i of sprites.values()) {i.render(ctx);}
		//draw all projectiles
		for (const i of projs) {i.render(ctx);}
		//draw msg board
		ctx.beginPath();
		ctx.fillStyle = '#0003';
		ctx.fillRect(10, 10, 190, 75);
		//draw msgs
		ctx.fillStyle = '#0009';
		ctx.font = '12px serif';
		ctx.textAlign = 'start';
		ctx.fillText(msgs[0], 20, 30);
		ctx.fillText(msgs[1], 20, 50);
		ctx.fillText(msgs[2], 20, 70);
	}

	//called every frame
	useEffect(() => {
		const canvas = canvasRef.current;
  	const context = canvas.getContext('2d');
		let animationFrameId;

  	const render = () => {
    	frameCount++;
			handle_shoot();
			move(me, dirs, socket);
			for (const i of projs) {i.move();}
			handle_collisions(sprites, projs, screen);
    	draw(context);
    	animationFrameId = window.requestAnimationFrame(render);
    }
    render();
    
    return () => {
    	window.cancelAnimationFrame(animationFrameId);
    }
  }, [frameCount]);

	return (
		<div className='App'>
			<div id='header'>
				<p className='text'>{`Playing as ${props.name}!`}</p>
				<button onClick={props.quit}>Quit</button>
			</div>

			<canvas id='screen' ref={canvasRef}/>
		</div>
	);
}

export default Game_Screen;

const fix_res = (canvas) => {
	let dpr = window.devicePixelRatio || 1;
	let rect = canvas.getBoundingClientRect();
	canvas.width = rect.width * dpr;
	canvas.height = rect.height * dpr;
	let ctx = canvas.getContext('2d');
	ctx.scale(dpr, dpr);
	return (new Screen(rect.width, rect.height));
}

const move = (player, dirs, socket) => {
	let [x,y] = player.get_pos();
	let moved = false;

	if (dirs[0]) {y-=2; moved = true;}
	if (dirs[1]) {x-=2; moved = true;}
	if (dirs[2]) {y+=2; moved = true;}
	if (dirs[3]) {x+=2; moved = true;}

	player.set_pos(x,y);
	if (moved) {socket.emit('moved', [x,y]);}
}

const handle_collisions = (players, projectiles, screen) => {
	for (let i = projectiles.length - 1; i >= 0; i--) {
		if (!collide(projectiles[i],screen)) {
			projectiles.splice(i,1);
			console.log('projectile destroyed');
		}
		/*for (const j of players.values()) {

		}*/
	}
}
const collide = (o1, o2) => {
	return !(o1.x > o2.x+o2.w || o2.x > o1.x+o1.w || o1.y+o1.h < o2.y || o2.y +o2.h < o1.y);
}

const get_time = () => {
	const d = new Date();
	return `[${d.getHours()}:${d.getMinutes()}]`;
}