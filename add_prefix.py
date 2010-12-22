import re
import sys

def add_prefix(line, prefix='ch-inject'):
    line = re.sub('\s\.(\w+)', lambda m:' .%s-%s' % (prefix, m.group(1)), line)
    return re.sub('(^|\s)pre\s', 'pre.%s ' % prefix, line)

if __name__ == '__main__':
    for line in sys.stdin:
        sys.stdout.write(add_prefix(line))

