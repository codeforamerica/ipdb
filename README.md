IP Address Database
===================
Distributed workers for collecting IP Address -> hostname mappings.

Example
=======
In one terminal, run:
<pre>
node fakeserver.js
</pre>
In another terminal, run:
<pre>
node worker.js
</pre>


server.js
=========
To be written

worker.js
=========
Requests work (a set of addresses) from the server.
Processes the work, then posts the results back to the server.

fakeserver.js
=============
Provides a fixed set of work, to test workers. Lets you know that it's doing
something, so you can test out the worker.
