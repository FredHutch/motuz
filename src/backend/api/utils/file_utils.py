import logging

def generate_file_tree(data):
    """
    Trees are of the form
    [
        { title: 'user1', children: [
            { title: 'file1.txt', hash: 'd621730bdf867a3453fb6b51a4ba0faa', type: 'modify' },


    @param data list(dict({
        Name,
        md5chksum,
    }))

    @return list(dict({
        title : str,
        children : list,
        hash : str,
        isLeaf : bool,
    }))
    """

    data.sort(key=lambda d: d["Name"])

    tree = []
    try:
        for item in data:
            # TODO: Figure out why there is a need for checking for none
            parts = item["Name"].split('/') if item is not None and item["Name"] is not None else []
            _generate_tree_leaf(tree, parts, item["md5chksum"])
    except Exception as e:
        logging.exception(e)

    return tree


def _generate_tree_leaf(branches, parts, md5chksum):
    """
    Recursive function that generates a tree leaf from parts

    @param branches: list(dict({
        title,
        children,
        hash,
        isLeaf,
    }))
    @param parts: list(str)
    @param md5chksum: str
    """

    for i, part in enumerate(parts):
        try:
            # TODO: optimize
            branch = next(branch for branch in branches if branch["title"] == part)
        except StopIteration:
            branch = {"title": part, "children": []}
            branches.append(branch)

        if i == len(parts) - 1:
            branch["hash"] = md5chksum
            branch["isLeaf"] = True
            del branch["children"]
        else:
            branches = branch["children"]



def remove_identical_branches(left, right):
    """
    @param left list(dict({
        title,
        children,
        hash,
        isLeaf,
    }))
    @param right list(dict({
        title,
        children,
        hash,
        isLeaf,
    }))

    @return new_left
    @return new_right
    """

    new_left = []
    new_right = []

    i = 0
    j = 0

    while i < len(left) and j < len(right):
        a = left[i]
        b = right[j]

        if a["title"] < b["title"]:
            new_left.append(a)
            i += 1
        elif a["title"] > b["title"]:
            new_right.append(b)
            j += 1
        else: # a["title"] == b["title"]
            if a.get("children") is not None and b.get("children") is not None: # Both folders
                a_children, b_children = remove_identical_branches(a["children"], b["children"])
                if not (len(a_children) == 0 and len(b_children) == 0):
                    # Append path if at least one side still has a diff
                    new_a = {
                        **a,
                        "children": a_children
                    }
                    new_b = {
                        **b,
                        "children": b_children
                    }
                    new_left.append(new_a)
                    new_right.append(new_b)
            elif a.get("hash") is not None and b.get("hash") is not None: # Both files
                if a["hash"] != b["hash"]:
                    new_left.append(a)
                    new_right.append(b)
            else: # One is file, other is folder
                new_left.append(a)
                new_right.append(b)

            i += 1
            j += 1

    while i < len(left):
        new_left.append(left[i])
        i += 1

    while j < len(right):
        new_right.append(right[j])

    return new_left, new_right
