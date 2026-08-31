extends Node

var _players: Array[AudioStreamPlayer] = []

func play_event(event_name: String) -> void:
	var player := AudioStreamPlayer.new()
	var stream := AudioStreamGenerator.new()
	stream.mix_rate = 22050.0
	stream.buffer_length = 0.12
	player.stream = stream
	add_child(player)
	_players.append(player)
	player.play()
	var playback := player.get_stream_playback() as AudioStreamGeneratorPlayback
	if playback:
		_fill_beep(playback, _frequency_for(event_name), 0.12)
	await get_tree().create_timer(0.16).timeout
	if is_instance_valid(player):
		player.queue_free()
	_players.erase(player)

func _frequency_for(event_name: String) -> float:
	match event_name:
		"record_start":
			return 330.0
		"record_stop":
			return 520.0
		"echo_spawn":
			return 740.0
		"echo_remove":
			return 190.0
		"activate":
			return 610.0
		"warning":
			return 130.0
		_:
			return 440.0

func _fill_beep(playback: AudioStreamGeneratorPlayback, frequency: float, duration: float) -> void:
	var mix_rate := 22050.0
	var frames := int(mix_rate * duration)
	for i in range(frames):
		var t := float(i) / mix_rate
		var envelope := 1.0 - (float(i) / float(frames))
		var sample := sin(TAU * frequency * t) * 0.16 * envelope
		playback.push_frame(Vector2(sample, sample))
