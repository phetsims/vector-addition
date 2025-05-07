// Copyright 2019-2025, University of Colorado Boulder

/**
 * EquationsSceneNode is a SceneNode that is specific to the 'Equations' screen.
 *
 * 'Is A' relationship with SceneNode but adds:
 *  - a RectangularRadioButtonGroup for EquationType
 *  - a Coefficient Selector Panel for each member of EquationType
 *  - a BaseVectorAccordionBox
 *  - 'register' Vectors and add their BaseVectors and components
 *  - Disables the Eraser button
 *
 * @author Brandon Li
 * @author Chris Malley (PixelZoom, Inc.)
 */

import AlignGroup from '../../../../scenery/js/layout/constraints/AlignGroup.js';
import { ComponentVectorStyle } from '../../common/model/ComponentVectorStyle.js';
import VectorAdditionConstants from '../../common/VectorAdditionConstants.js';
import SceneNode from '../../common/view/SceneNode.js';
import vectorAddition from '../../vectorAddition.js';
import EquationsScene from '../model/EquationsScene.js';
import BaseVectorsAccordionBox from './BaseVectorsAccordionBox.js';
import EquationsViewProperties from './EquationsViewProperties.js';
import EquationAccordionBox from './EquationAccordionBox.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import VectorSet from '../../common/model/VectorSet.js';
import BaseVector from '../../common/model/BaseVector.js';
import Property from '../../../../axon/js/Property.js';

export default class EquationsSceneNode extends SceneNode {

  // Public for pdomOrder at ScreenView level.
  public readonly equationAccordionBox: Node;
  public readonly baseVectorsAccordionBox: Node;

  public constructor( scene: EquationsScene,
                      sceneProperty: TReadOnlyProperty<EquationsScene>,
                      viewProperties: EquationsViewProperties,
                      componentVectorStyleProperty: TReadOnlyProperty<ComponentVectorStyle>,
                      graphControlPanelBottom: number,
                      equationButtonsAlignGroup: AlignGroup, // used to make all equation radio buttons the same size
                      equationsAlignGroup: AlignGroup, // used to make all interactive equations the same size
                      tandem: Tandem ) {

    super( scene, sceneProperty, viewProperties, componentVectorStyleProperty, {
      includeEraser: false,
      tandem: tandem
    } );

    // Relocate the 'Vector Values' accordion box so that we have room for the 'Equation' accordion box
    this.vectorValuesAccordionBox.top = VectorAdditionConstants.SCREEN_VIEW_BOUNDS.minY + VectorAdditionConstants.SCREEN_VIEW_Y_MARGIN;

    // Add the 'Equation' accordion box
    const equationAccordionBox = new EquationAccordionBox( scene.vectorSet, scene.equationTypeProperty,
      equationButtonsAlignGroup, equationsAlignGroup, {
        expandedProperty: viewProperties.equationAccordionBoxExpandedProperty,
        centerX: scene.graph.viewBounds.centerX,
        top: this.vectorValuesAccordionBox.bottom + 10,
        tandem: tandem.createTandem( 'equationAccordionBox' )
      } );
    this.addChild( equationAccordionBox );
    equationAccordionBox.moveToBack(); // move to back to ensure that this.vectorContainer remains in front

    // Add the 'Base Vector' accordion box
    const baseVectorsAccordionBox = new BaseVectorsAccordionBox( viewProperties.baseVectorsVisibleProperty,
      scene.coordinateSnapMode,
      scene.vectorSet, {
        expandedProperty: viewProperties.baseVectorsAccordionBoxExpandedProperty,
        right: VectorAdditionConstants.SCREEN_VIEW_BOUNDS.maxX - VectorAdditionConstants.SCREEN_VIEW_X_MARGIN,
        top: graphControlPanelBottom + 8,
        tandem: tandem.createTandem( 'baseVectorsAccordionBox' )
      } );
    this.addChild( baseVectorsAccordionBox );
    baseVectorsAccordionBox.moveToBack(); // move to back to ensure that this.vectorContainer remains in front

    // Add vectors and their base vectors.
    scene.vectorSet.equationsVectors.forEach( vector => {
      this.registerVector( vector, scene.vectorSet );
      this.addBaseVectorNode( scene.vectorSet, vector.baseVector, viewProperties.baseVectorsVisibleProperty );
    } );

    this.equationAccordionBox = equationAccordionBox;
    this.baseVectorsAccordionBox = baseVectorsAccordionBox;
  }

  /**
   * Adds a base vector Node to the scene.
   */
  private addBaseVectorNode( vectorSet: VectorSet, baseVector: BaseVector, baseVectorsVisibleProperty: Property<boolean> ): void {
    this.getVectorSetNode( vectorSet ).addBaseVectorNode( baseVector, baseVectorsVisibleProperty, vectorSet.vectorColorPalette );
  }
}

vectorAddition.register( 'EquationsSceneNode', EquationsSceneNode );