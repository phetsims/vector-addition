// Copyright 2019-2025, University of Colorado Boulder

/**
 * EquationsVector is a specialization of Vector for the 'Equations' screen.  It adds mutable coefficient and base vector.
 * Instances exist for the lifetime of the sim and do not need to be disposed.
 *
 * @author Brandon Li
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Multilink from '../../../../axon/js/Multilink.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import BaseVector from '../../common/model/BaseVector.js';
import CartesianBaseVector from '../../common/model/CartesianBaseVector.js';
import PolarBaseVector from '../../common/model/PolarBaseVector.js';
import { LabelDisplayData } from '../../common/model/RootVector.js';
import Vector from '../../common/model/Vector.js';
import vectorAddition from '../../vectorAddition.js';
import EquationsScene from './EquationsScene.js';
import EquationsVectorSet from './EquationsVectorSet.js';
import Tandem from '../../../../tandem/js/Tandem.js';

// initial coefficient and range
const DEFAULT_COEFFICIENT = 1;
const COEFFICIENT_RANGE = new Range( -5, 5 );

export default class EquationsVector extends Vector {

  public readonly coefficientProperty: NumberProperty;
  public readonly baseVector: BaseVector;

  /**
   * @param initialTailPosition - starting tail position of the vector
   * @param initialComponents - starting components of the vector
   * @param baseVectorTailPosition - starting tail position of the base vector
   * @param scene - the scene the vector belongs to
   * @param vectorSet - the VectorSet that the vector belongs to
   * @param symbolProperty - the symbol for the vector (i.e. 'a', 'b', 'c', ...)
   * @param tandemNameSymbol - symbol for the vector used in tandem names
   * @param tandem
   */
  public constructor( initialTailPosition: Vector2,
                      initialComponents: Vector2,
                      baseVectorTailPosition: Vector2,
                      scene: EquationsScene,
                      vectorSet: EquationsVectorSet,
                      symbolProperty: TReadOnlyProperty<string>,
                      tandemNameSymbol: string,
                      tandem: Tandem ) {

    super( initialTailPosition, initialComponents, scene, vectorSet, symbolProperty, {
      isRemovableFromGraph: false, // Equations vectors are not removable from the graph
      isTipDraggable: false, // Equations vectors are not draggable by the tip
      isOnGraphInitially: true, // Equations vectors are always on the graph
      isOnGraphPropertyInstrumented: false, // Equations vectors are always on the graph
      tandemNameSymbol: tandemNameSymbol,
      tandem: tandem
    } );

    this.coefficientProperty = new NumberProperty( DEFAULT_COEFFICIENT, {
      range: COEFFICIENT_RANGE,
      tandem: tandem.createTandem( 'coefficientProperty' )
    } );

    // Set the tip to itself to ensure Invariants for Polar/Cartesian is satisfied.
    this.setTipWithInvariants( this.tip );

    // Instantiate a base vector based on scene.
    if ( scene.coordinateSnapMode === 'cartesian' ) {
      this.baseVector = new CartesianBaseVector( baseVectorTailPosition, this.xyComponents.dividedScalar( DEFAULT_COEFFICIENT ),
        scene, vectorSet, symbolProperty, tandemNameSymbol, tandem.createTandem( 'baseVector' ) );
    }
    else {
      this.baseVector = new PolarBaseVector( baseVectorTailPosition, this.xyComponents.dividedScalar( DEFAULT_COEFFICIENT ),
        scene, vectorSet, symbolProperty, tandemNameSymbol, tandem.createTandem( 'baseVector' ) );
    }

    // Observe when the base vector changes, or when the coefficient Property changes and update the vector.
    Multilink.multilink( [ this.baseVector.xyComponentsProperty, this.coefficientProperty ],
      ( xyComponents, coefficient ) => {
        this.xyComponentsProperty.value = xyComponents.timesScalar( coefficient );
      } );
  }

  public override reset(): void {
    this.coefficientProperty.reset();
    this.baseVector.reset();
    super.reset();
  }

  /**
   * Vectors in the Equations screen have an associated coefficient.
   * See RootVector.getLabelDisplayData for details.
   */
  public override getLabelDisplayData( valuesVisible: boolean ): LabelDisplayData {
    return combineOptions<LabelDisplayData>( super.getLabelDisplayData( valuesVisible ), {
      coefficient: this.coefficientProperty.value
    } );
  }
}

vectorAddition.register( 'EquationsVector', EquationsVector );