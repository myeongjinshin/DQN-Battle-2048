def calc_point(state):
    pscore=0
    aiscore=0
    n = len(state)//2
    for i in range(n) :
        if state[i] > 0 : aiscore = aiscore + 2**(state[i]-1)
        if state[i+n] > 0 : pscore = pscore + 2**(state[i+n]-1)
    return [pscore, aiscore]

def calc_reward(bef_state, aft_state, done):
    [bef_p, bef_ai] = calc_point(bef_state)
    [aft_p, aft_ai] = calc_point(aft_state)
    ret = (aft_ai-aft_p) - (bef_ai-bef_p)
    ret = ret / (aft_p+aft_ai)
    ret = ret * 300
    print(bef_state)
    print(aft_state)
    print(ret, bef_p, bef_ai, aft_p, aft_ai)
    return ret

def normal(state):
    ma = max(state)
    for i in range(len(state)):
        if state[i] == 0 : continue
        state[i] = 2**(state[i]-ma)
    return state

f = open("replay.txt")
w = open("changed.txt", "w")
while True:
    line = f.readline().strip()
    if not line: break
    line = line.replace("false", "False")
    line = line.replace("true", "True")
    a = eval(line)

    bef_state = a["state"]
    nxt_state = a["next_state"]
    reward = calc_reward(bef_state, nxt_state, a["done"])

    wl = str({
        "state":normal(bef_state),
        "action":a["action"],
        "reward":a["reward"],
        "nxt_state":normal(nxt_state),
        "done":a["done"]
        })
    wl = wl + "\n"
    wl.replace("False", "false")
    wl.replace("True", "true")
    w.write(wl)




