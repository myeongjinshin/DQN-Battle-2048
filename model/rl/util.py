
from ast import literal_eval


def load_from_replay(addr) :
    memory = []

    with open(addr, "r") as f:
            while True :
                line = f.readline()
                line = line.replace("false", "False");
                line = line.replace("true", "True");
                if not line :
                    break
                curr = literal_eval(line)
                curr['state'] = state_parser(curr['state'])
                curr['next_state'] = state_parser(curr['state'])

                memory.append(curr)
    
    return memory


def state_parser(state) :
    ret = [[[0 for i in range(32)] for j in range(5)] for k in range(5)]
    for i in range(len(state)) :
        x = i//5
        y = i%5
        if state[i] > 0 :
            ret[x][y][state[i]-1]=1
        else :
            ret[x][y][-state[i]-1+16]=1
    return ret
