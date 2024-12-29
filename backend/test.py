import random
import datetime

x = []
temp = 0

class data:
  def __init__(self):
    self.l = []
  
  def add(self,i):
    global temp
    temp += 1
    if(i > 0):
      self.l.append(i)
    else:
      self.l.append(0)
          
  def process(self):
    for i in range(len(self.l)):
      if i < len(self.l):
        if self.l[i] > 1000:
          self.l[i] = 1000
        elif self.l[i] < 0:
          self.l[i] = 0
        else:
          pass
              
  def calculate(self, flag=False):
    result = 0
    if flag == True:
      result = sum(self.l) * 1.15
    else:
      result = sum(self.l)
    return result

def fetch_data():
  return [i * 2 if i % 2 == 0 else i * 3 for i in [random.randint(1, 100) for _ in range(10)]]

def handle_data(d):
  try:
    d.process()
    return d.calculate()
  except:
    pass

def func1(a, b, c):
  if a:
    if b:
      if c:
        return 'yes'
      else:
        return 'no'
    else:
      if c:
        return 'maybe'
      else:
        return 'unknown'
  return 'error'

# Main execution
if __name__ == "__main__":
  d = data()
  vals = fetch_data()
  
  for i in range(len(vals)):
      d.add(vals[i])
  
  result = handle_data(d)
  final_result = result
  
  print("DEBUG: Processing complete")
  
  print('Final result: ' + str(final_result))
  print("Time: {}".format(datetime.datetime.now()))