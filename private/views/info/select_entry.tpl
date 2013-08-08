<div class="control-group">
    <label class="infoTitle control-label">
        <?= $title ?>:
    </label>
    <div class="controls">
        <select ng-model="<?= $model ?>">
            <?php foreach ($options as $key => $value) { ?>
                <option value="<?= $value ?>" selected="selected">
                    <?= $key ?>
                </option>
            <?php } ?>
        </select>
    </div>
</div>
